const mongoose = require('mongoose')
const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DB = process.env.MONGO_URI

mongoose.set('strictQuery', true)
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB Cluster Connected')
	})
	.catch((error) => console.log('mongodb not connected.', error.message))

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`)
})
