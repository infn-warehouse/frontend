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
  
    <div v-if="status==1" class="inner-element">
      {{ $t('file_upload.complete1')+this.uploadedFile.name+$t('file_upload.complete2') }}
    </div>
    <div v-if="status==2" class="inner-element">
      {{ $t('file_upload.error') }}
    </div>
    <div v-if="status==3" class="inner-element">
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

export default {
  components: {
    KProgress
  },
  props: {
    fileGroup: {
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
      this.isLoading=true;
      this.progress=0;
      this.status=0;

      let bodyFormData = new FormData();
      bodyFormData.append('fileGroup', this.fileGroup);
      bodyFormData.append('data', this.selectedFile);

      this.cancel=ApiService.upload("alfresco/"+encodeURI(this.selectedFile.name),bodyFormData,(progress) => {
        this.progress=Math.round(progress);
      }, (status) => {
        if (status==200) {
          this.isLoading=false;
          this.uploadedFile=this.selectedFile;
          this.selectedFile=null;
          this.status=1;
          this.$emit('onUploadComplete', this.uploadedFile);
        }
        else if  (status==-1) {
          this.isLoading=false;
          this.status=3;
        }
        else {
          this.isLoading=false;
          this.status=2;
        }
      }, (e) => {
        this.checkResult(e);
      });
    },
    doCancel() {
      this.cancel();
    }
  },
  created() {
  }
};
</script>
