<template>
  <div class="my-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <v-card-text>
        <FileUploader/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import enums from "@/enums";
import FileUploader from "@/components/FileUploader";

export default {
  name: 'UploadTest',

  components: {
    Toolbar,
    FileUploader
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
  },

  data() {
    return {
      title: this.$t("custom.upload_test"),
    };
  }
};
</script>
