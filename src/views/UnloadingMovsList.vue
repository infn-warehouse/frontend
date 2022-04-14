<template>
  <div class="list-container-outer">
    <div :class="{ 'hide-shrink': drawer_flag, 'list-container': true }">
      <v-card>
        <Toolbar
          :title="resourceTypes"
          :withAdd="true"
          :allClear="allClear"
          @onAdd="openCreate"
        />
        <BaseGrid
          tableName="unloading_movs"
          :headers="tableData.headers2"
          :items="tableData.items2"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading"
          :withActions="true"
          :withEdit="true"
          :withDelete="true"
          @onPaginationChanged="handlePaginationChanged"
          @onEdit="openUpdate"
          @onDelete="handleDelete"
        ></BaseGrid>
        <v-dialog
          v-model="formDialog"
          content-class="edit-form-dialog"
        >
          <v-card>
            <MovementForm
              v-if="formDialog"
              :mode="mode"
              :selectedItem="editItem"
              @formSucceed="_fetch()"
              @formClose="close()"
            />
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import BaseGrid from "@/components/BaseGrid";
import _ from "lodash";
import helper from "@/mixins/helper";
import formDialog from "@/mixins/formDialog";
import listShared from "@/mixins/listShared";
import MovementForm from "@/components/forms/MovementForm";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'UnloadingMovsList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
  },

  mixins: [helper,formDialog,listShared],

  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    mapHeaders() {
      let tableHeaders=[];
      tableHeaders.push({
        value: "articolo",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "numeroBuono",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dataBuono",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "quantita",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "prezzo",
        sortable: true,
        align: "start"
      });
      return tableHeaders;
    },
    mapItems() {
      let tableItems = _.map(this.items, item => {
        let tableItem={};
        tableItem.baseItem=item;
        tableItem.fields = {
          articolo: { data: item.articolo, dataType: "text" },
          numeroBuono: { data: item.numeroBuono, dataType: "text" },
          dataBuono: { data: item.dataBuono, dataType: "date" },
          quantita: { data: item.quantita, dataType: "text" },
          prezzo: { data: item.prezzo, dataType: "text" },
        };
        return tableItem;
      });
      return tableItems;
    },
    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "MovimentiScarico",
        "MovimentiS",
        "numeroBuono",
        item,
        payload => payload.p.numeroBuono
      );
    },
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("MovimentiScarico",[],["quantita"],filter,null,paginationOpts);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.unloading_mov"),
      resourceTypes: this.$t("resource_types.unloading_movs"),
      mergeOpts: {
        sortBy: ["dataBuono","numeroBuono"],
        sortDesc: [false,false],
      },
      noFilter: true,
      immutableFilterField: "articolo"
    };
  }
};
</script>
