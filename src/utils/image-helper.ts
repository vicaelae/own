import { computed } from 'vue'
import { UploadedImageModel, ExternalLinkType } from '@/common/model'
import { getUuid } from '@/utils/common-utils'
import { generateExternalLink } from '@/utils/external-link-handler'
import { store } from '@/store'

const userConfigInfo = computed(() => store.getters.getUserConfigInfo).value

export default function structureImageObject(
  item: any,
  selectedDir: string
): UploadedImageModel {
  return {
    type: 'image',
    uuid: getUuid(),
    dir: selectedDir,
    name: item.name,
    path: item.path,
    sha: item.sha,
    deleting: false,
    is_transform_md: false,
    size: item.size,
    checked: false,
    github_url: generateExternalLink(ExternalLinkType.github, item, userConfigInfo),
    jsdelivr_cdn_url: generateExternalLink(
      ExternalLinkType.jsdelivr,
      item,
      userConfigInfo
    ),
    staticaly_cdn_url: generateExternalLink(
      ExternalLinkType.staticaly,
      item,
      userConfigInfo
    ),
    zzko_cdn_url: generateExternalLink(ExternalLinkType.zzko, item, userConfigInfo)
  }
}
