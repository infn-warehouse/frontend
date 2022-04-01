<template>
  <div class="my-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <v-card-text>
        <FileUploader
          @onUploadComplete="handleUpload"
        />
        <FilesList ref="filesList"/>
      </v-card-text>
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
