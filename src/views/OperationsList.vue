<template>
  <div class="list-container-outer">
    <OperationsFilter
      tableName="operations"
      ref="drawer"
      :headers="tableData.headers"
      @drawerChanged="handleDrawer"
      @onChange="handleFilterChange"
    ></OperationsFilter>
    <div :class="{ 'hide-shrink': drawer_flag, 'list-container': true }">
      <v-card>
        <Toolbar
          :title="resourceTypes"
          :withFilter="true"
          :withSearch="true"
          :allClear="allClear"
          @onFilter="$refs.drawer.open()"
          @onSearch="handleSearch"
        />
        <BaseGrid
          tableName="operations"
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
          @onEdit="item => openUpdate(0,item)"
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
import OperationsFilter from "@/components/filters/OperationsFilter";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'OperationsList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
    OperationsFilter
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
        value: "operatore",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "data",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "risorsa",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "tipo",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "dettagli",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "stato",
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
          operatore: { data: item.operatore, dataType: "text" },
          data: { data: item.data, dataType: "datetime" },
          risorsa: { data: item.risorsa, dataType: "text" },
          tipo: { data: this.$t("langEnums.tipo."+item.tipo), dataType: "text" },
          dettagli: { data: this.doReplace(item.dettagli,this.$t("detailsString"),true), dataType: "text" },
          stato: { data: this.$t("langEnums.stato."+item.stato), dataType: "text" },
        };
        tableItem.disableDelete = item.stato!="draft";
        tableItem.actions = [
          {
            actionType: "custom",
            icon: enums.ICONS.PLAY,
            disabled: item.stato!="draft",
            callback: (item) => {
              this.$router.push({
                name: "Registration",
                params: {
                  resumeOp: this.formatOp(item)
                }
              }).catch(()=>{});
            },
          },
        ];
        // tableItem.click_action = {
        //   actionType: "router-link",
        //   namedRoot: "ItemDetails",
        //   namedRootId: item.codiceArticolo,
        //   icon: "gps_fixed"
        // };
        return tableItem;
      });
      return tableItems;
    },
    formatOp(item) {
      return {
        ...item,
        subList: JSON.parse(item.subList),
        savedData: JSON.parse(item.savedData),
        id: [ item.data, item.operatore ]
      };
    },
    delete(item,op,subIndex) {
      return this.abortConfirm(
        this.formatOp(item),""
      );
      // return this.deleteConfirm(
      //   op,
      //   subIndex,
      //   this.resourceType,
      //   "Operation",
      //   "Operation",
      //   ["data","operatore"],
      //   item,
      //   payload => this.$t("langEnums.tipo."+payload.p.tipo)+" "+payload.p.risorsa
      // );
    },
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Operation",[],[],filter,{search, on: []},paginationOpts);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.operation"),
      resourceTypes: this.$t("resource_types.operations"),
      mergeOpts: {
        sortBy: ["data"],
        sortDesc: [true],
      },
      idName: "",
    };
  }
};
</script>
