<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withEdit="true"
        :withDelete="true"
        @onEdit="openUpdate(selectedItem)"
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
          <v-tab key="tabAttachments">{{ $t("custom.attachments") }}</v-tab>
          <v-tab key="tabMovements">{{ $t("details.orders.tabMovements") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tabAttachments">
            <div class="my-container">
              <FileUploader
                @onUploadComplete="handleUpload"
                :fileGroup="this.selectedItem.fileGroup"
              />
            </div>
            <FilesList
              ref="filesList"
              :immutableFilter="this.selectedItem.fileGroup"
              :title="$t('custom.attachments')"
            />
          </v-tab-item>
          <v-tab-item key="tabMovements">
            <MovementsList
              :immutableFilter="selectedItem.idordine"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-dialog
          v-model="formDialog"
          content-class="edit-form-dialog"
        >
          <v-card>
            <OrderForm
              v-if="formDialog"
              :mode="mode"
              :selectedItem="editItem"
              @formSucceed="fetch()"
              @formClose="close()"
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
import OrderForm from "@/components/forms/OrderForm";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";
import MovementsList from "@/views/MovementsList";
import FileUploader from "@/components/FileUploader";
import FilesList from "@/views/FilesList";

export default {
  name: "OrderDetails",
  data() {
    return {
      home: "Orders",
      resourceType: this.$t("resource_types.order"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setOrdersFlag"]),
    
    fetch(id) {
      return GraphileService.fetchOne("OrdiniView",[],id,"idordine");
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.idordine+" ("+item.fornitore+" | "+item.descrizione+")");
    },

    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "Ordini",
        "Ordini",
        "idordine",
        item,
        payload => payload.p.idordine
      );
    },

    handleUpload(file) {
      this.$refs.filesList.refresh();
    },
  },
  created() {
    this.setOrdersFlag(true);
  },
  components: {
    OrderForm,
    Toolbar,
    MovementsList,
    FileUploader,
    FilesList
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
