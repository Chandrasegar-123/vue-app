<template>
  <div class="d-flex justify-content-center align-items-center my-3">
    <button class="btn btn-primary me-2" @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button class="btn btn-primary ms-2" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script>
export default {
  name: 'PaginationBar',
  props: {
    currentPage: Number,
    totalPages: Number
  },
  methods: {
    prevPage() {
      this.$emit('prev-page');
    },
    nextPage() {
      this.$emit('next-page');
    }
  }
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>