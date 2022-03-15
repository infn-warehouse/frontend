<template>
  <div>
    <ItemsFilter
      ref="drawer"
      @drawerChanged="handleDrawer"
      @onChange="handleChange"
    ></ItemsFilter>
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
          tableName="items"
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
              @formSucceed="fetch()"
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
import ItemsFilter from "@/components/filters/ItemsFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'ItemsList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
    ItemsFilter
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
        value: "codiceArticolo",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "descrizione",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "specifica",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "misura",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "coefficiente",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "carico",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "scarico",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "giacenza",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "scorta",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "ubicazione",
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
          codiceArticolo: { data: item.codiceArticolo, dataType: "text" },
          descrizione: { data: item.descrizione, dataType: "text" },
          specifica: { data: item.specifica, dataType: "text" },
          misura: { data: item.misura, dataType: "text" },
          coefficiente: { data: item.coefficiente, dataType: "text" },
          carico: { data: item.carico, dataType: "text" },
          scarico: { data: item.scarico, dataType: "text" },
          giacenza: { data: item.giacenza, dataType: "text" },
          scorta: { data: item.scorta, dataType: "text" },
          ubicazione: { data: item.ubicazioniByUbicazione ? item.ubicazioniByUbicazione.descrizione : "", dataType: "text" },
        };
        return tableItem;
      });
      return tableItems;
    },
    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "service",
        item,
        payload => payload.p.id
      );
    },
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Articoli",["ubicazioni"],paginationOpts,{search, on: ["codiceArticolo","descrizione","specifica","ubicazioni.descrizione"]},filter);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.item"),
      resourceTypes: this.$t("resource_types.items"),
      mergeOpts: {
        sortBy: ["codiceArticolo"],
        sortDesc: [false],
      },
    };
  }
};
</script>
