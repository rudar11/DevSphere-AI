import Redis from "ioredis";


const redisClient = new Redis({

host:process.env.REDIS_HOST,
port:process.env.REDIS_PORT,
password:process.env.REDIS_PASSWORD,

})

redisClient.on('connect' ,()=>{ // jab redis successfullfy create ho jaaye tab console kra dee
//     Syntax: object.on('eventName', callbackFunction)
//     Matlab: “Jab ye event ho, tab ye function execute karo”
    console.log("redis connected")
})

export default redisClient