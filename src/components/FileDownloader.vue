<template>
  <div>
    <div><b>{{ $t("file_download.name") }}</b>: {{this.file.name}}</div>
    <div class="inner-element"><b>{{ $t("file_download.size") }}</b>: {{this.file.size | size}}</div>
    <v-btn
      @click="download()"
      color="primary"
    >
      {{ $t('file_download.downloadButton') }}
    </v-btn>
  </div>
</template>

<script>
import ApiService from "@/services/api.service";
import helper from "@/mixins/helper";

export default {
  props: ["file"],
  components: {
  },
  mixins: [helper],
  data() {
    return {
    }
  },
  methods: {
    async download() {
      let res=await this.operationWithCheck(async () => await ApiService.get("alfresco/"+encodeURI(this.file.name)+"/link"));
      if (res)
        window.open(res.data, '_blank');
    }
  },
  created() {
  }
};
</script>
