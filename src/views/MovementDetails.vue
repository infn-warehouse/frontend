<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withEdit="true"
        :withDelete="true"
        :buttons="buttons"
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
          <v-tab key="tabDelivery">{{ $t("details.movements.tabDelivery") }}</v-tab>
          <v-tab key="tabTesting">{{ $t("details.movements.tabTesting") }}</v-tab>
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
          <v-tab-item key="tabDelivery">
            <div class="flex-container">
              <div><b>{{ $t("headers.movements.dataConsegna") }}</b>: {{this.selectedItem.dataConsegna | date}}</div>
              <div><b>{{ $t("headers.movements.consegnatario") }}</b>: {{this.selectedItem.consegnatario}}</div>
              <div><b>{{ $t("headers.movements.nColli") }}</b>: {{this.selectedItem.nColli}}</div>
            </div>
          </v-tab-item>
          <v-tab-item key="tabTesting">
            <div class="flex-container">
              <div><b>{{ $t("headers.movements.dataCollaudo") }}</b>: {{this.selectedItem.dataCollaudo | date}}</div>
              <div><b>{{ $t("headers.movements.tipoCollaudo") }}</b>: {{this.selectedItem.tipoCollaudo}}</div>
              <div><b>{{ $t("headers.movements.collaudatore") }}</b>: {{this.selectedItem.collaudatore}}</div>
            </div>
          </v-tab-item>
        </v-tabs-items>
        <v-dialog
          v-model="formDialog"
          content-class="edit-form-dialog"
        >
          <v-card>
            <MovementForm
              v-if="formDialog"
              :mode="mode"
              :selectedItem="editItem"
              @formSucceed="handleSucceed"
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
import MovementForm from "@/components/forms/MovementForm";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";
import FileUploader from "@/components/FileUploader";
import FilesList from "@/views/FilesList";

export default {
  name: "MovementDetails",
  data() {
    return {
      home: "Movements",
      resourceType: this.$t("resource_types.movement"),
      buttons: [
        {
          text: this.$t("details.movements.fill"),
          callback: () => {
            this.fillModuleAndOpen("LNS-1000-TES-IR_CIG",{
              ...this.selectedItem,
              dataRow1: new Date()
            },["ordiniByIdOrdine","documentoByTipoDocAcc"],{
              "dataRow1": "date",
              "ordiniByIdOrdine.importo": "currency",
              "datadocumento": "date",
            });
          },
          icon: enums.ICONS.PRINT
        }
      ]
    };
  },
  methods: {
    ...mapMutations("filters", ["setMovementsFlag"]),
    
    fetch() {
      return GraphileService.fetchOne("MovimentiTemp",["documento","ordini"],this.id,"idMovimento");
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.nMovimento+" ("+item.idOrdine+")");
    },

    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "MovimentiTemp",
        "Movimenti",
        "idMovimento",
        item,
        payload => payload.p.nMovimento
      );
    },

    handleUpload(file) {
      this.$refs.filesList.refresh();
    },
  },
  created() {
    this.setMovementsFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
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
