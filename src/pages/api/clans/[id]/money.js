import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import credentials from '@/middlewares/credentials'

import Clan from '@/models/clan'

const handler = nextConnect()

handler
	.use(middleware)
	.use(credentials)

/**
 * @method GET
 * @endpoint /api/clans/:id/money
 * @description Get the clan's total money
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const clanId = req.query.id
	let clan = null

	if (!isNaN(clanId)){
		clan = await Clan
		.findById(clanId)
		.select('properties.money')
		.lean()
		.exec()
	}

	res.status(200)
		.json({
			sucesss: !!clan,
			data: clan && clan.properties.money,
			timestamp: new Date()
		})
})

export default handler