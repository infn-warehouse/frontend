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
          <v-tab key="tab1">{{ $t("details.orders.tab1") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tab1">
            <div class="flex-container">
              <MovementsList
                :immutableFilter="selectedItem.idordine"
              />
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
import MovementsList from "@/views/MovementsList";

export default {
  name: "OrderDetails",
  data() {
    return {
      home: "Orders",
      resourceType: this.$t("resource_types.order"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setOrdersFlag"]),
    
    fetch(id) {
      return GraphileService.fetchOne("OrdiniWithCounters",[],id,"idordine");
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.idordine+" ("+item.fornitore+" | "+item.descrizione+")");
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
  },
  created() {
    this.setOrdersFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
    MovementsList,
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
