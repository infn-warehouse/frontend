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
          <v-tab key="tab1">{{ $t("details.movements.tab1") }}</v-tab>
          <v-tab key="tab2">{{ $t("details.movements.tab2") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tab1">
            <div class="flex-container">
              <div><b>{{ $t("headers.movements.dataConsegna") }}</b>: {{this.selectedItem.dataConsegna | date}}</div>
              <div><b>{{ $t("headers.movements.consegnatario") }}</b>: {{this.selectedItem.consegnatario}}</div>
              <div><b>{{ $t("headers.movements.nColli") }}</b>: {{this.selectedItem.nColli}}</div>
            </div>
          </v-tab-item>
          <v-tab-item key="tab2">
            <div class="flex-container">
              <div><b>{{ $t("headers.movements.dataCollaudo") }}</b>: {{this.selectedItem.dataCollaudo | date}}</div>
              <div><b>{{ $t("headers.movements.tipoCollaudo") }}</b>: {{this.selectedItem.tipoCollaudo}}</div>
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
import MovementForm from "@/components/forms/MovementForm";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";

export default {
  name: "MovementDetails",
  data() {
    return {
      home: "Movements",
      resourceType: this.$t("resource_types.movement"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setMovementsFlag"]),
    
    fetch(id) {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],id,"idMovimento");
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
  },
  created() {
    this.setMovementsFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
