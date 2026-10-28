<template>
  <div>
    <div v-for="field in fields" :key="field.key" class="shipping-attachment">
      <div class="shipping-title"><span v-if="!readonly && !field.optional" class="required">*</span>{{ field.label }}</div>
      <p v-if="showLoadingPhotoHint && !readonly && field.key.startsWith('zczp')" class="shipping-hint"><span class="li-span-red">*</span>必填项，如无可上传说明材料</p>
      <file-download-view v-if="readonly" :fileList="files[field.key] || []" />
      <component v-else :is="field.key.startsWith('zczp') ? 'FileUploadViewType' : 'FileUploadView'"
        :class="{ 'loading-photo-uploader': field.key.startsWith('zczp') }"
        :fileList="files[field.key]" :required="!field.optional" :maxCount="100"
        accept=".jpg,.png,.jpeg,.pdf" businessType="01" />
    </div>
  </div>
</template>
<script>
import FileUploadView from './FileUploadView.vue';
import FileUploadViewType from './FileUploadViewType.vue';
import FileDownloadView from './FileDownloadView.vue';
import { shippingFields, readShippingFiles } from '@/utils/shippingAttachments';
export default {
  components: { FileUploadView, FileUploadViewType, FileDownloadView },
  props: { model: { type: Object, default: null }, value: { default: null }, readonly: Boolean, qualityOnly: Boolean, showLoadingPhotoHint: Boolean },
  computed: {
    fields() { return shippingFields.filter(field => !this.qualityOnly || !field.key.startsWith('zczp')); },
    files() { return this.model || readShippingFiles(this.value); }
  }
};
</script>
<style scoped>
.shipping-attachment { background: #fff; border-radius: 7px; margin: 8px 6px; padding: 10px; min-width: 0; box-sizing: border-box; }
.shipping-title { font-size: 13px; margin-bottom: 10px; color: #151b3e; }
.shipping-hint { margin: 22px 0 13px; max-width: 100%; font-size: 11px; line-height: 18px; color: #4a4a4a; text-align: center; white-space: normal; overflow-wrap: break-word; }
.shipping-hint span { vertical-align: middle; }
.loading-photo-uploader ::v-deep .file-info { width: auto !important; min-width: 0; }
.loading-photo-uploader ::v-deep .file-info > span { min-width: 0; overflow-wrap: anywhere; }
.loading-photo-uploader ::v-deep .file-info > img { flex-shrink: 0; }
.required { color: #ee0a24; margin-right: 4px; }
</style>
