<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <div class="my-container">
        <FileUploader
          @onUploadComplete="handleUpload"
        />
      </div>
      <FilesList ref="filesList"/>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import enums from "@/enums";
import FileUploader from "@/components/FileUploader";
import FilesList from "@/views/FilesList";

export default {
  name: 'UploadTest',

  components: {
    Toolbar,
    FileUploader,
    FilesList
  },

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    }
  },
  async created() {
  },
  
  methods: {
    handleUpload(file) {
      this.$refs.filesList.refresh();
    }
  },

  data() {
    return {
      title: this.$t("custom.upload_test"),
    };
  }
};
</script>
