import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Planet from '@/models/planet'
import Transaction from '@/models/transaction'
import User from '@/models/user'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method post
 * @endpoint /api/clans/:id/transfer/redeem
 * @description Get rewards form code
 * 
 * @body code, planet_id
 * 
 * @require User authentication
 */
handler.post(async (req, res) => {
  let code = req.body.code

  if (code == null) {
    return Response.denined(res, 'Please enter a code')
  }

  code = code.trim()

  const clan = await Clan
    .findById(req.query.id)
    .exec()

  if (clan == null) {
    return Response.denined(res, 'mai mee clan nai database')
  }

  const user = await User
    .findById(req.user.id)
    .lean()
    .exec()

  if ((clan.leader != req.user.id) && (user.role != 'admin') && (user.role != 'mod')) {
    return Response.denined(res, 'only clan leader can perform this action')
  }

  const planet = await Planet
    .findOne({ _id: req.body.planet_id })
    .exec()

  if (!planet) {
    return Response.denined(res, 'Planet not found')
  }

  if ((planet._id != clan.position) && user.role != 'admin') {
    return Response.denined(res, 'Planet not found')
  }

  if (planet.redeem != code) {
    planet.visitor = 0
    clan.position = clan._id

    await planet.save()
    await clan.save()

    req.socket.server.io.emit('set.clan', clan._id, clan)
    req.socket.server.io.emit('set.planet', planet._id, planet)

    return Response.denined(res, 'Your code is incorrect. You will be teleport to your home planet.')
  }

  if (planet.owner == clan._id) {
    return Response.denined(res, 'You already own this planet')
  }

  if (planet.owner != 0) {
    return Response.denined(res, 'This planet has owner')
  }

  const transaction = await Transaction.create({
    owner: {
      id: clan._id,
      type: 'clan'
    },
    receiver: {
      id: planet._id,
      type: 'planet'
    },
    item: {
      planets: [planet.id]
    },
    status: 'SUCCESS'
  })

  clan.owned_planet_ids.push(planet._id)
  clan.position = clan._id
  planet.owner = clan._id
  planet.visitor = 0
  await clan.save()
  await planet.save()

  delete planet.redeem

  if (planet && clan) {
    req.socket.server.io.emit('set.clan', clan._id, clan)
    req.socket.server.io.emit('set.planet', planet._id, planet)
    req.socket.server.io.emit('set.transaction', clan._id, transaction)
  }

  return Response.success(res, {
    clan_id: clan._id,
    planet_id: transaction.item.planets,
    redeem_code: code
  })
})

export default handler