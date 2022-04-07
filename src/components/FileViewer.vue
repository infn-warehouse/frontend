<template>
  <div>
    <k-progress
      class="inner-element"
      v-if="isLoading"
      active
      type="line"
      :color="['#40a9ff', '#5cdbd3']"
      :percent="progress"
      :line-height="32" >
    </k-progress>
  
    <div v-if="status==2" class="inner-element">
      {{ $t('file_download.error') }}
    </div>
    <v-icon v-if="!viewable" x-large>{{ enums.ICONS.FILE_BAN }}</v-icon>
    <div v-if="!viewable" class="bottom-element">
      {{ $t('file_download.cannotDisplay') }}
    </div>

    <iframe v-if="url" :src="url"></iframe>
  </div>
</template>

<script>
import ApiService from "@/services/api.service";
import KProgress from 'k-progress';
import helper from "@/mixins/helper";

export default {
  props: ["name"],
  components: {
    KProgress
  },
  mixins: [helper],
  data() {
    return {
      isLoading: false,
      progress: 0,
      status: 0,
      cancel: null,
      url: null,
      viewable: false
    }
  },
  methods: {
    doDownload() {
      this.isLoading=true;
      this.progress=0;
      this.status=0;

      this.cancel=ApiService.download("alfresco/"+encodeURI(this.name),(progress) => {
        this.progress=Math.round(progress);
      }, (status, data) => {
        if (status==200) {
          this.isLoading=false;
          this.status=1;

          this.url = window.URL.createObjectURL(new Blob([data]));
        }
        else if (status==-1) {
          this.isLoading=false;
          this.status=3;
        }
        else {
          this.isLoading=false;
          this.status=2;
        }
      });
    },
    doCancel() {
      this.cancel();
    },
  },
  created() {
    let viewableTypes=["png","jpg","jpeg","pdf","txt"];

    let ext=this.name.split('.').slice(-1).pop();
    this.viewable=viewableTypes.includes(ext.toLowerCase());

    if (this.viewable)
      this.doDownload();
  }
};
</script>

<style scoped>

iframe {
  display: block;
  width: 100%;
  height: 480px;
  border: none;
}

</style>
