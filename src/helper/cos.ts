import COS from 'cos-nodejs-sdk-v5'
import fs from 'fs'

// cos 前缀
const cosPrefix = 'https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com'

const cos = new COS({
  SecretId: 'AKIDd9UcVDi16xZ0MYdXN3XotpY5TdYDcnjP',
  SecretKey: 'UigOq3zf5GExPeiZAVL1UihU4PVMzOXR'
})

const bucket = {
  Bucket: 'cdn-1257429552',
  Region: 'ap-guangzhou',
  Key: 'json',
  cdn: '',
  path: '/'
}

export const cosUpload = async (info: any) => {
  return new Promise((resolve, reject) => {
    const { filepath, newFilename, suffix } = info
    const objectKey = `${bucket.Key + bucket.path + newFilename}.${suffix}`
    cos.putObject(
      {
        Bucket: bucket.Bucket,
        Region: bucket.Region,
        Key: objectKey,
        StorageClass: 'STANDARD',
        Body: fs.createReadStream(filepath),
        onProgress: (progressData: any) => {
          const { percent } = progressData
          console.log(`上传进度 --- ${percent}%`)
        }
      },
      (err: any, data: any) => {
        console.log('data =>', data)
        if (err) {
          reject(err)
        } else {
          resolve({
            url: `${cosPrefix}/${objectKey}`,
            ...info
          })
        }
      }
    )
  })
}
