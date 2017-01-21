import Crypto from 'crypto-js'

export default {
  generateS3Signature(root, args, { user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    console.log(args)
    console.log(process.env.S3_SIGNING_SECRET)
    const timestamp = args.datetime.substr(0, 8)
    console.log(timestamp)
    const kDate = Crypto.HmacSHA256(timestamp, `AWS4${process.env.S3_SIGNING_SECRET}`)
    const kRegion = Crypto.HmacSHA256('us-west-1', kDate)
    const kService = Crypto.HmacSHA256('s3', kRegion)
    const kSigning = Crypto.HmacSHA256('aws4_request', kService)
    return Crypto.HmacSHA256(args.stringToSign, kSigning).toString()
  }
}
