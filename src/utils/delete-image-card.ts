import { UploadedImageModel, UserConfigInfoModel, DeleteStatusEnum } from '@/common/model'
import axios from '@/utils/axios'
import { store } from '@/store'

let deleteIndex = 0

export async function deleteSingleImage(
  imageObj: UploadedImageModel,
  userConfigInfo: UserConfigInfoModel
): Promise<boolean> {
  // eslint-disable-next-line no-param-reassign
  imageObj.deleting = true
  const { owner, selectedRepos } = userConfigInfo
  return new Promise((resolve, reject) => {
    axios
      .delete(`/repos/${owner}/${selectedRepos}/contents/${imageObj.path}`, {
        data: {
          owner,
          repo: selectedRepos,
          path: imageObj.path,
          message: 'delete picture via PicX(https://github.com/XPoet/picx)',
          sha: imageObj.sha
        }
      })
      .then((res) => {
        if (res && res.status === 200) {
          // eslint-disable-next-line no-param-reassign
          imageObj.deleting = false
          store.dispatch('UPLOADED_LIST_REMOVE', imageObj.uuid)
          store.dispatch('DIR_IMAGE_LIST_REMOVE', imageObj)
          resolve(true)
        } else {
          // eslint-disable-next-line no-param-reassign
          imageObj.deleting = false
          resolve(false)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function delelteBatchImage(
  imgCardArr: Array<UploadedImageModel>,
  userConfigInfo: UserConfigInfoModel
) {
  if (deleteIndex >= imgCardArr.length) {
    return DeleteStatusEnum.deleted
  }
  if (await deleteSingleImage(imgCardArr[deleteIndex], userConfigInfo)) {
    if (deleteIndex < imgCardArr.length) {
      deleteIndex += 1
      if (await delelteBatchImage(imgCardArr, userConfigInfo)) {
        deleteIndex = 0
        return DeleteStatusEnum.allDeleted
      }
    }
    return DeleteStatusEnum.deleted
  }
  return DeleteStatusEnum.deleteFail
}
