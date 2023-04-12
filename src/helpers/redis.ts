const upstashRedisResstUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashRedisResstUrl}/${command}/${args.join('/')}`

    const response = await fetch(commandUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        // somethimes next js have weird cache just bypass it
        cache: 'no-store'
      })
      if(!response.ok){
        throw new Error(`Error eexecuting Redis command: ${response.statusText}`)
      }
      const data = await response.json()
      return data.result
}