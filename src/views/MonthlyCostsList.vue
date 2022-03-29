<template>
  <div>
    <div class="my-container">
      <v-card :class="{ 'center-panel': drawer_flag }">
        <Toolbar
          :title="resourceTypes"
        />
        <BaseGrid
          tableName="monthly_costs"
          :headers="tableData.headers2"
          :items="tableData.items2"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading>0"
          @onPaginationChanged="handlePaginationChanged"
        ></BaseGrid>
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
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'MonthlyCostsList',

  components: {
    BaseGrid,
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
        value: "mese",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "spesa",
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
          mese: { data: item.mese, dataType: "month" },
          spesa: { data: item.spesa, dataType: "currency" },
        };
        return tableItem;
      });
      return tableItems;
    },
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("SpeseMesi",[],[],filter,null,paginationOpts);
    },
  },

  data() {
    return {
      resourceTypes: this.$t("resource_types.monthly_costs"),
      mergeOpts: {
        sortBy: ["mese"],
        sortDesc: [true],
      },
      noFilter: true
    };
  }
};
</script>
