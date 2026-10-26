<template>
  <div>
    <div v-for="field in fields" :key="field.key" class="shipping-attachment">
      <div class="shipping-title"><span v-if="!readonly && !field.optional" class="required">*</span>{{ field.label }}</div>
      <file-download-view v-if="readonly" :fileList="files[field.key] || []" />
      <component v-else :is="field.key.startsWith('zczp') ? 'FileUploadViewType' : 'FileUploadView'"
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
  props: { model: { type: Object, default: null }, value: { default: null }, readonly: Boolean, qualityOnly: Boolean },
  computed: {
    fields() { return shippingFields.filter(field => !this.qualityOnly || !field.key.startsWith('zczp')); },
    files() { return this.model || readShippingFiles(this.value); }
  }
};
</script>
<style scoped>
.shipping-attachment { background: #fff; border-radius: 7px; margin: 8px 6px; padding: 10px; }
.shipping-title { font-size: 13px; margin-bottom: 10px; color: #151b3e; }
.required { color: #ee0a24; margin-right: 4px; }
</style>
