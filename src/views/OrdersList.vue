<template>
  <div class="list-container-outer">
    <OrdersFilter
      tableName="orders"
      ref="drawer"
      :headers="tableData.headers"
      @drawerChanged="handleDrawer"
      @onChange="handleChange"
    ></OrdersFilter>
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
          tableName="orders"
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
            <OrderForm
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
import items from "@/mixins/items";
import formDialog from "@/mixins/formDialog";
import listShared from "@/mixins/listShared";
import OrderForm from "@/components/forms/OrderForm";
import OrdersFilter from "@/components/filters/OrdersFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'OrdersList',

  components: {
    BaseGrid,
    OrderForm,
    Toolbar,
    OrdersFilter
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
        value: "idordine",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dataordine",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "fornitore",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "descrizione",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "terminiCons",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "servizioRichi",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "responsabile",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "importo",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "statOrdine",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "nConsegne",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "dataconsegna",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "note",
        sortable: true,
        align: "start",
        show: 1
      });
      tableHeaders.push({
        value: "cig",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "rup",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "nColli",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "movimentiCount",
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
          idordine: { data: item.idordine, dataType: "text" },
          dataordine: { data: item.dataordine, dataType: "date" },
          fornitore: { data: item.fornitore, dataType: "text" },
          descrizione: { data: item.descrizione, dataType: "text" },
          terminiCons: { data: item.terminiCons, dataType: "text" },
          servizioRichi: { data: item.servizioRichi, dataType: "text" },
          responsabile: { data: item.responsabile, dataType: "text" },
          importo: { data: item.importo, dataType: "currency" },
          statOrdine: this.mapValue(item.statOrdine,this.orderItems.statOrdine,true),
          nConsegne: { data: item.nConsegne, dataType: "text" },
          dataconsegna: { data: item.dataconsegna, dataType: "date" },
          note: { data: item.note, dataType: "text" },
          cig: { data: item.cig, dataType: "text" },
          rup: { data: item.rup, dataType: "text" },
          nColli: { data: item.nColli, dataType: "text" },
          movimentiCount: { data: item.movimentiCount, dataType: "text" },
        };
        tableItem.click_action = {
          actionType: "router-link",
          namedRoot: "OrderDetails",
          namedRootId: item.idordine.toString(),
          icon: "gps_fixed"
        };
        return tableItem;
      });
      return tableItems;
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
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("OrdiniView",[],[],filter,{search, on: [
        "idordine",
        "fornitore",
        "descrizione",
        "servizioRichi",
        "responsabile",
        "note",
        "cig",
        "rup"
      ]},paginationOpts);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.order"),
      resourceTypes: this.$t("resource_types.orders"),
      mergeOpts: {
        sortBy: ["dataordine"],
        sortDesc: [true],
      },
    };
  }
};
</script>
