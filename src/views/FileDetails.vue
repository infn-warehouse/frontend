<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withEdit="true"
        :withDelete="true"
        @onEdit="openUpdate(0,selectedItem)"
        @onDelete="handleDelete"
      ></Toolbar>

      <template v-if="selectedItem">
        <v-tabs
          v-model="activeTab"
          @change="syncUrl"
          background-color="secondary"
          slider-color="accent"
          dark
        >
          <v-tab key="tabView">{{ $t("details.files.tabView") }}</v-tab>
          <v-tab key="tabDownload">{{ $t("details.files.tabDownload") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tabView">
            <div class="flex-container">
              <FileViewer
                :name="selectedItem.name"
              />
            </div>
          </v-tab-item>
          <v-tab-item key="tabDownload">
            <div class="flex-container">
              <FileDownloader
                :file="selectedItem"
              />
            </div>
          </v-tab-item>
        </v-tabs-items>
        <v-dialog
          v-model="formDialog[0]"
          content-class="edit-form-dialog"
        >
          <v-card>
            <MovementForm
              v-if="formDialog[0]"
              :mode="mode[0]"
              :selectedItem="editItem[0]"
              @formSucceed="handleSucceed"
              @formClose="closeDialog(0)"
            />
          </v-card>
        </v-dialog>
      </template>
    </v-card>
  </div>
</template>

<script>
import enums from "@/enums";
import helper from "@/mixins/helper";
import MovementForm from "@/components/forms/MovementForm";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";
import FileViewer from "@/components/FileViewer";
import FileDownloader from "@/components/FileDownloader";

export default {
  name: "FileDetails",
  data() {
    return {
      home: "UploadTest",
      resourceType: this.$t("resource_types.file"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setFilesFlag"]),
    
    fetch() {
      return GraphileService.fetchOne("Alfresco",[],this.id,"name");
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.name);
    },

    delete(item,op,subIndex) {
      return this.deleteConfirm(
        op,
        subIndex,
        this.resourceType,
        "Alfresco",
        "Alfresco",
        "name",
        item,
        payload => payload.p.name
      );
    },
  },
  created() {
    this.setFilesFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
    FileViewer,
    FileDownloader
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
