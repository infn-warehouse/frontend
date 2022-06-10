<template>
  <div class="list-container-outer">
    <MovementsFilter
      tableName="movements"
      ref="drawer"
      :headers="tableData.headers"
      @drawerChanged="handleDrawer"
      @onChange="handleChange"
    ></MovementsFilter>
    <div :class="{ 'hide-shrink': drawer_flag, 'list-container': true }">
      <v-card>
        <Toolbar
          :title="resourceTypes"
          :withFilter="true"
          :withSearch="true"
          :withAdd="true"
          :allClear="allClear"
          @onFilter="$refs.drawer.open()"
          @onSearch="handleSearch"
          @onAdd="openCreate"
        />
        <BaseGrid
          tableName="movements"
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
              :model="immutableFilter"
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
import items from "@/mixins/items";
import formDialog from "@/mixins/formDialog";
import listShared from "@/mixins/listShared";
import MovementForm from "@/components/forms/MovementForm";
import MovementsFilter from "@/components/filters/MovementsFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'MovementsList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
    MovementsFilter
  },

  mixins: [helper,items,formDialog,listShared],

  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    mapHeaders() {
      let tableHeaders=[];
      tableHeaders.push({
        value: "nMovimento",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dataMovimento",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "idOrdine",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "datadocumento",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "tipoDocAcc",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "nDocAcc",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dataConsegna",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "consegnatario",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "nColli",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dataCollaudo",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "note",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "codificaSpaziale",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "tipoCollaudo",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "collaudatore",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "inUscita",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "tipoMovimento",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "tipoUscita",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "tipoReso",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "dataRitiro",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "corriere",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "trackingNum",
        sortable: true,
        align: "start",
        show: 1
      });
      return tableHeaders;
    },
    mapItems() {
      let tableItems = _.map(this.items, item => {
        let tableItem={};
        tableItem.baseItem=item;
        tableItem.fields = {
          idMovimento: { data: item.idMovimento, dataType: "text" },
          nMovimento: { data: item.nMovimento, dataType: "text" },
          dataMovimento: { data: item.dataMovimento, dataType: "date" },
          idOrdine: { data: item.idOrdine, dataType: "text" },
          datadocumento: { data: item.datadocumento, dataType: "date" },
          tipoDocAcc: { data: item.documentoByTipoDocAcc ? item.documentoByTipoDocAcc.dicitura : "?", dataType: "chip" },
          nDocAcc: { data: item.nDocAcc, dataType: "text" },
          dataConsegna: { data: item.dataConsegna, dataType: "date" },
          consegnatario: { data: item.consegnatario, dataType: "text" },
          nColli: { data: item.nColli, dataType: "text" },
          dataCollaudo: { data: item.dataCollaudo, dataType: "date" },
          note: { data: item.note, dataType: "text" },
          codificaSpaziale: { data: item.codificaSpaziale, dataType: "text" },
          tipoCollaudo: { data: item.tipoCollaudo, dataType: "text" },
          collaudatore: { data: item.collaudatore, dataType: "text" },
          inUscita: this.mapValue(item.inUscita,this.movementItems.inUscita,true),
          tipoMovimento: this.mapValue(item.tipoMovimento,this.movementItems.tipoMovimento,true),
          tipoUscita: this.mapValue(item.tipoUscita,this.movementItems.tipoUscita,true),
          tipoReso: this.mapValue(item.tipoReso,this.movementItems.tipoReso,true),
          dataRitiro: { data: item.dataRitiro, dataType: "datetime" },
          corriere: { data: item.corriere, dataType: "text" },
          trackingNum: { data: item.trackingNum, dataType: "text" },
        };
        /*{
          actionType: "custom",
          callback: () => {
          },
        }*/
        tableItem.click_action = {
          actionType: "router-link",
          namedRoot: "MovementDetails",
          namedRootId: item.idMovimento.toString(),
          icon: "gps_fixed"
        };
        //tableItem.actions = [];
        return tableItem;
      });
      return tableItems;
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
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("MovimentiTemp",["documento"],[],filter,{search, on: [
        "nMovimento",
        "idOrdine",
        "nDocAcc",
        "consegnatario",
        "note",
        "collaudatore",
      ]},paginationOpts);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.movement"),
      resourceTypes: this.$t("resource_types.movements"),
      mergeOpts: {
        sortBy: ["dataMovimento"],
        sortDesc: [true],
      },
      immutableFilterField: "idOrdine"
    };
  }
};
</script>
