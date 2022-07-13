<template>
  <div class="list-container-outer">
    <MovementsFilter
      tableName="movements"
      ref="drawer"
      :headers="tableData.headers"
      @drawerChanged="handleDrawer"
      @onChange="handleFilterChange"
    ></MovementsFilter>
    <div :class="{ 'hide-shrink': drawer_flag, 'list-container': true }">
      <v-card>
        <Toolbar
          :title="resourceTypes"
          :withFilter="true"
          :withSearch="true"
          :withAdd="false"
          :allClear="allClear"
          @onFilter="$refs.drawer.open()"
          @onSearch="handleSearch"
          @onAdd="item => openCreate(0,item)"
        />
        <BaseGrid
          tableName="movements"
          :headers="tableData.headers2"
          :items="tableData.items2"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading"
          :withActions="true"
          :withDelete="true"
          :disableList="disableList"
          :idName="idName"
          @onPaginationChanged="handlePaginationChanged"
          @onDelete="handleDelete"
        ></BaseGrid>
        <v-dialog
          v-model="formDialog[0]"
          content-class="edit-form-dialog"
        >
          <v-card>
            <MovementForm
              v-if="formDialog[0]"
              :mode="mode[0]"
              :selectedItem="editItem[0]"
              @formSucceed="_fetch()"
              @formClose="closeDialog(0)"
              :model="immutableFilter"
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
              @formSucceed="_fetch()"
              @formClose="closeDialog(1)"
              :showReason="true"
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
import OrderForm from "@/components/forms/OrderForm";
import MovementsFilter from "@/components/filters/MovementsFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'MovementsList',

  components: {
    BaseGrid,
    MovementForm,
    OrderForm,
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
        value: "inUscita",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "statOrdine",
        sortable: true,
        align: "start",
        group: 1,
        modes: [0,1]
      });
      tableHeaders.push({
        value: "tipoDocAcc",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "datadocumento",
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
        align: "start",
        modes: [0,1]
      });
      tableHeaders.push({
        value: "nColliOrdine",
        sortable: true,
        align: "start",
        group: 1,
      });
      tableHeaders.push({
        value: "idordine",
        sortable: true,
        align: "start",
        group: 1
      });
      tableHeaders.push({
        value: "cig",
        sortable: true,
        align: "start",
        group: 1,
      });

      // tableHeaders.push({
      //   value: "nMovimento",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "dataMovimento",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "datadocumento",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "tipoDocAcc",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "nDocAcc",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "dataConsegna",
      //   sortable: true,
      //   align: "start",
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "nColli",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "dataCollaudo",
      //   sortable: true,
      //   align: "start",
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "note",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "tipoCollaudo",
      //   sortable: true,
      //   align: "start",
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "collaudatore",
      //   sortable: true,
      //   align: "start",
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "inUscita",
      //   sortable: true,
      //   align: "start"
      // });
      // tableHeaders.push({
      //   value: "tipoMovimento",
      //   sortable: true,
      //   align: "start",
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "tipoUscita",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "tipoReso",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "dataRitiro",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "corriere",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "trackingNum",
      //   sortable: true,
      //   align: "start",
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "idOrdine",
      //   sortable: true,
      //   align: "start",
      //   group: 1
      // });
      // tableHeaders.push({
      //   value: "richiAnagrafica",
      //   sortable: true,
      //   align: "start",
      //   modes: [2]
      // });
      // tableHeaders.push({
      //   value: "gruppoAppart",
      //   sortable: true,
      //   align: "start",
      //   modes: [2]
      // });
      // tableHeaders.push({
      //   value: "causaleMov",
      //   sortable: true,
      //   align: "start",
      //   modes: [2]
      // });
      // tableHeaders.push({
      //   value: "autorizzazione",
      //   sortable: true,
      //   align: "start",
      //   modes: [2]
      // });



      // tableHeaders.push({
      //   value: "dataordine",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "fornitore",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "descrizione",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "servizioRichi",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "importo",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "statOrdine",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "dataconsegna",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1,
      //   modes: [0,1]
      // });
      // tableHeaders.push({
      //   value: "noteOrdine",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "cig",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "rup",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });
      // tableHeaders.push({
      //   value: "nColliOrdine",
      //   sortable: true,
      //   align: "start",
      //   group: 1,
      //   show: 1
      // });

      return tableHeaders;
    },
    mapItems() {
      let tableItems = _.map(this.items, item => {
        let tableItem={};
        tableItem.baseItem=item;
        tableItem.fields = {
          nMovimento: { data: item.nMovimento, dataType: "text" },
          dataMovimento: { data: item.dataMovimento, dataType: "date" },
          inUscita: this.mapValue(item.inUscita,this.movementItems.inUscita,true),
          statOrdine: this.mapValue(item.statOrdine,this.orderItems.statOrdine,true),
          tipoDocAcc: { data: item.dicitura!=null ? item.dicitura : "?", dataType: "chip" },
          datadocumento: { data: item.datadocumento, dataType: "date" },
          nDocAcc: { data: item.nDocAcc, dataType: "text" },
          dataConsegna: { data: item.dataConsegna, dataType: "date" },
          nColliOrdine: { data: item.nColliOrdine, dataType: "text" },
          idordine: { data: item.idordine, dataType: "text" },
          cig: { data: item.cig, dataType: "text" },

          // idMovimento: { data: item.idMovimento, dataType: "text" },
          // nMovimento: { data: item.nMovimento, dataType: "text" },
          // dataMovimento: { data: item.dataMovimento, dataType: "date" },
          // datadocumento: { data: item.datadocumento, dataType: "date" },
          // tipoDocAcc: { data: item.dicitura!=null ? item.dicitura : "?", dataType: "chip" },
          // nDocAcc: { data: item.nDocAcc, dataType: "text" },
          // dataConsegna: { data: item.dataConsegna, dataType: "date" },
          // nColli: { data: item.nColli, dataType: "text" },
          // dataCollaudo: { data: item.dataCollaudo, dataType: "date" },
          // note: { data: item.note, dataType: "text" },
          // tipoCollaudo: this.mapValue(item.tipoCollaudo,this.movementItems.tipoCollaudo),
          // collaudatore: { data: item.collaudatore, dataType: "text" },
          // inUscita: this.mapValue(item.inUscita,this.movementItems.inUscita,true),
          // tipoMovimento: this.mapValue(item.tipoMovimento,this.movementItems.tipoMovimento,true),
          // tipoUscita: this.mapValue(item.tipoUscita,this.movementItems.tipoUscita),
          // tipoReso: this.mapValue(item.tipoReso,this.movementItems.tipoReso),
          // dataRitiro: { data: item.dataRitiro, dataType: "datetime" },
          // corriere: { data: item.corriere, dataType: "text" },
          // trackingNum: { data: item.trackingNum, dataType: "text" },
          // idOrdine: { data: item.idOrdine, dataType: "text" },
          // richiAnagrafica: { data: item.richiAnagrafica, dataType: "text" },
          // gruppoAppart: { data: item.gruppoAppart, dataType: "text" },
          // causaleMov: { data: item.causale!=null ? item.causale : "?", dataType: "text" },
          // autorizzazione: { data: item.autorizzazione, dataType: "bool" },

          // dataordine: { data: item.dataordine, dataType: "date" },
          // fornitore: { data: item.fornitore, dataType: "text" },
          // descrizione: { data: item.descrizione, dataType: "text" },
          // servizioRichi: { data: item.servizioRichi, dataType: "text" },
          // importo: { data: item.importo, dataType: "currency" },
          // statOrdine: this.mapValue(item.statOrdine,this.orderItems.statOrdine,true),
          // dataconsegna: { data: item.dataconsegna, dataType: "date" },
          // noteOrdine: { data: item.noteOrdine, dataType: "text" },
          // cig: { data: item.cig, dataType: "text" },
          // rup: { data: item.rup, dataType: "text" },
          // nColliOrdine: { data: item.nColliOrdine, dataType: "text" },
        };

        tableItem.click_action = {
          actionType: "router-link",
          namedRoot: "MovementDetails",
          namedRootId: item.idMovimento.toString(),
          icon: "gps_fixed"
        };

        tableItem.actions = [
          {
            actionType: "custom",
            icon: enums.ICONS.EDIT,
            tooltip: this.$t("custom.editMovement"),
            callback: (item) => {
              this.openUpdate(0,item);
            },
          },
          {
            actionType: "custom",
            icon: enums.ICONS.EDIT,
            tooltip: this.$t("custom.editOrder"),
            callback: (item) => {
              this.openUpdate(1,item);
            },
          }
        ];

        return tableItem;
      });
      return tableItems;
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
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("MovimentiView",["documento","ordini"],[],filter,{search, on: [
        "nMovimento",
        "idOrdine",
        "nDocAcc",
        "note",
        "collaudatore",

        "idordine",
        "fornitore",
        "descrizione",
        "servizioRichi",
        "noteOrdine",
        "cig",
        "rup"
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
      immutableFilterField: "idOrdine",
      filterDraft: true,
      idName: "",
    };
  }
};
</script>
