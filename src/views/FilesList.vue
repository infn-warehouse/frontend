<template>
  <div class="list-container-outer">
    <div :class="{ 'hide-shrink': drawer_flag, 'list-container': true }">
      <v-card>
        <Toolbar
          :title="title || resourceTypes"
          :allClear="allClear"
          @onAdd="openCreate"
        />
        <BaseGrid
          tableName="files"
          :headers="tableData.headers2"
          :items="tableData.items2"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading"
          :withActions="true"
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
  name: 'FilesList',

  components: {
    BaseGrid,
    MovementForm,
    Toolbar,
  },

  props: {
    title: {
      required: false
    },
    noDetails: {
      required: false
    },
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
        value: "user",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "name",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "size",
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
          user: { data: item.user, dataType: "text" },
          name: { data: item.name, dataType: "text" },
          size: { data: item.size, dataType: "size" },
        };
        if (!this.noDetails)
          tableItem.click_action = {
            actionType: "router-link",
            namedRoot: "FileDetails",
            namedRootId: item.name,
            icon: "gps_fixed"
          };
        // tableItem.click_action = {
        //   actionType: "custom",
        //   callback: () => {
        //     window.open(item.link, '_blank');
        //   },
        // };
        return tableItem;
      });
      return tableItems;
    },
    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "Alfresco",
        "Alfresco",
        "name",
        item,
        payload => payload.p.name
      );
    },
    fetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Alfresco",[],[],filter,null,paginationOpts);
    },
  },

  data() {
    return {
      resourceType: this.$t("resource_types.file"),
      resourceTypes: this.$t("resource_types.files"),
      mergeOpts: {
        sortBy: [],
        sortDesc: [],
      },
      noFilter: true,
      immutableFilterField: "fileGroup"
    };
  }
};
</script>
