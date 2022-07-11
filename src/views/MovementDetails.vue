<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withDelete="true"
        :buttons="buttons"
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
          <v-tab key="tabAttachmentsMovement">{{ $t("details.movements.attachmentsMovement") }}</v-tab>
          <v-tab key="tabAttachmentsOrder">{{ $t("details.movements.attachmentsOrder") }}</v-tab>
          <v-tab key="tabTesting">{{ $t("details.movements.tabTesting") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tabAttachmentsMovement">
            <div class="my-container">
              <FileUploader
                @onUploadComplete="handleUpload1"
                :fileGroup="this.selectedItem.fileGroup"
              />
            </div>
            <FilesList
              ref="filesList1"
              :immutableFilter="this.selectedItem.fileGroup"
              :title="$t('details.movements.attachmentsMovement')"
            />
          </v-tab-item>
          <v-tab-item key="tabAttachmentsOrder">
            <div class="my-container">
              <FileUploader
                @onUploadComplete="handleUpload2"
                :fileGroup="this.selectedItem.ordiniByIdOrdine.fileGroup"
              />
            </div>
            <FilesList
              ref="filesList2"
              :immutableFilter="this.selectedItem.ordiniByIdOrdine.fileGroup"
              :title="$t('details.movements.attachmentsOrder')"
            />
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
              :showReason="true"
            />
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="formDialog[1]"
          content-class="edit-form-dialog"
        >
          <v-card>
            <OrderForm
              v-if="formDialog[1]"
              :mode="mode[1]"
              :selectedItem="editItem[1]"
              @formSucceed="form => handleSucceed(form,'ordiniByIdOrdine')"
              @formClose="closeDialog(1)"
              :showReason="true"
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
import OrderForm from "@/components/forms/OrderForm";
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
      resourceType2: this.$t("resource_types.order"),
      typeName: "movements",
      typeName2: "orders",
      buttons: [
        {
          text: this.$t("details.orders.change"),
          callback: async () => {
            let newStatus=this.selectedItem.ordiniByIdOrdine.statOrdine=='C' ? 'S' : 'C';
            let res=await this.createOrUpdateHelper(
              null,
              null,
              null,
              this.mode,
              this.resourceType2,
              this.typeName2,
              "Ordini",
              "idordine",
              {
                idordine: this.selectedItem.ordiniByIdOrdine.idordine,
                statOrdine: newStatus
              },
              null,
              this.selectedItem.ordiniByIdOrdine.idordine,
              payload => payload.p.idordine,
              payload => payload.p.idordine
            );
            if (res) {
              this.selectedItem.ordiniByIdOrdine.statOrdine=newStatus;
              this.computeButtonColor();
            }
          },
          icon: enums.ICONS.CHANGE
        },
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
        },
        {
          text: this.$t("custom.editMovement"),
          callback: () => {
            this.openUpdate(0,this.selectedItem);
          },
          icon: enums.ICONS.EDIT
        },
        {
          text: this.$t("custom.editOrder"),
          callback: () => {
            this.openUpdate(1,this.selectedItem.ordiniByIdOrdine);
          },
          icon: enums.ICONS.EDIT
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

    delete(item,op,subIndex) {
      return this.deleteConfirm(
        op,
        subIndex,
        this.resourceType,
        "MovimentiTemp",
        "Movimenti",
        "idMovimento",
        item,
        payload => payload.p.nMovimento
      );
    },

    handleUpload1(file) {
      this.$refs.filesList1.refresh();
    },
    handleUpload2(file) {
      this.$refs.filesList2.refresh();
    },
    
    computeButtonColor() {
      this.buttons[0].color=this.selectedItem.ordiniByIdOrdine.statOrdine=='C' ? 'yellow darken-2' : 'green';
      this.buttons=[...this.buttons];
    },

    handleUpdate() {
      this.computeButtonColor();
    }
  },
  created() {
    this.setMovementsFlag(true);
  },
  components: {
    MovementForm,
    OrderForm,
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
