<template>
  <div>
    <v-file-input
      show-size
      :label="$t('file_upload.select')"
      v-model="selectedFile"
      @change="handleChange"
      :disabled="isLoading"
    ></v-file-input>
    <k-progress
      class="inner-element"
      v-if="isLoading"
      active
      type="line"
      :color="['#40a9ff', '#5cdbd3']"
      :percent="progress"
      :line-height="32" >
    </k-progress>
  
    <div v-if="status==0 && !isLoading" class="inner-element loading-label">
      &nbsp;
    </div>
    <div v-if="status==1" class="inner-element loading-label">
      {{ $t('file_upload.complete1')+this.uploadedFile.name+$t('file_upload.complete2') }}
    </div>
    <div v-if="status==2" class="inner-element loading-label">
      {{ $t('file_upload.error') }}
    </div>
    <div v-if="status==3" class="inner-element loading-label">
      {{ $t('file_upload.cancel') }}
    </div>

    <v-btn
      @click="doUpload()"
      color="primary"
      :disabled="isLoading || !selectedFile"
      >{{ $t('file_upload.uploadButton') }}</v-btn
    >
    <v-btn
      @click="doCancel()"
      class="ml-3"
      color="primary"
      :disabled="!isLoading"
      >{{ $t('file_upload.cancelButton') }}</v-btn
    >
  </div>
</template>

<script>
import ApiService from "@/services/api.service";
import KProgress from 'k-progress';
import helper from "@/mixins/helper";

export default {
  components: {
    KProgress
  },
  mixins: [helper],
  props: {
    fileGroup: {
      required: false
    },
    draft: {
      required: false
    },
  },
  data() {
    return {
      isLoading: false,
      selectedFile: null,
      uploadedFile: null,
      progress: 0,
      status: 0,
      cancel: null
    }
  },
  methods: {
    handleChange() {
      this.status=0;
    },
    doUpload() {
      this.setLoading(true);
      this.progress=0;
      this.status=0;

      let payload={
        fileGroup: this.fileGroup,
        draft: this.draft
      }

      let bodyFormData = new FormData();
      bodyFormData.append('payload', JSON.stringify(payload));
      bodyFormData.append('data', this.selectedFile);

      this.cancel=ApiService.upload("alfresco/"+encodeURI(this.selectedFile.name),bodyFormData,(progress) => {
        this.progress=Math.round(progress);
      }, (status) => {
        if (status==200) {
          this.setLoading(false);
          this.uploadedFile=this.selectedFile;
          this.selectedFile=null;
          this.status=1;
          this.$emit('onUploadComplete', this.uploadedFile);
        }
        else if (status==-1) {
          this.setLoading(false);
          this.status=3;
        }
        else {
          this.setLoading(false);
          this.status=2;
        }
      }, (e) => {
        if (this.checkResult(e)) {
          this.setLoading(false);
          this.status=3;
        }
        else {
          this.setLoading(false);
          this.status=2;
        }
      });
    },
    doCancel() {
      this.cancel();
    },
    setLoading(isLoading) {
      this.isLoading=isLoading;
      this.$emit('onLoading', isLoading);
    }
  },
  created() {
  }
};
</script>

<style scoped>

.loading-label {
  line-height: 32px;
}

</style>
