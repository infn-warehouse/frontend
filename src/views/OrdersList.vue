<template>
  <div>
    <OrdersFilter
      ref="drawer"
      @drawerChanged="handleDrawer"
      @onChange="handleChange"
    ></OrdersFilter>
    <div class="my-container">
      <v-card :class="{ 'center-panel': drawer_flag }">
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
          :headers="tableData.headers"
          :items="tableData.items"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading>0"
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
import OrdersFilter from "@/components/filters/OrdersFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'OrdersList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
    OrdersFilter
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
        value: "statOrdine",
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
          statOrdine: { data: item.statOrdine, dataType: "text" },
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
      return GraphileService.fetchAll("OrdiniWithCounters",[],[],filter,{search, on: ["idordine","fornitore","descrizione"]},paginationOpts);
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
