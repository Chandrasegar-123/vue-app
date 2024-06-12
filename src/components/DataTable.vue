<template>
  <div v-if="loading" class="text-center my-5">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="d-flex justify-content-between gap-5 mb-3">
      <div class="w-75 d-flex justify-content-between">
        <SearchBar @update-query="filterData" />
      </div>
      <div class="w-25 d-flex align-items-center justify-content-end">
        <label class="vertical-align-center" for="pageSizeSelect">Rows per page:</label>
        <select id="pageSizeSelect" class="form-select w-50" v-model="pageSize" @change="updatePageSize">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option :value="filteredData.length">All</option>
        </select>
      </div>
    </div>
    <div>
        <table class="table table-striped table-bordered">
        <thead>
            <tr>
            <th @click="sortData('postId')" class="sortable">Post ID <i :class="getSortClass('postId')"></i></th>
            <th @click="sortData('id')" class="sortable">ID <i :class="getSortClass('id')"></i></th>
            <th @click="sortData('name')" class="sortable">Name <i :class="getSortClass('name')"></i></th>
            <th @click="sortData('email')" class="sortable">Email <i :class="getSortClass('email')"></i></th>
            <th @click="sortData('body')" class="sortable">Body <i :class="getSortClass('body')"></i></th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
            <td>{{ item.postId }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.body }}</td>
            <td>
                <button @click="deleteItem(item.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
            </tr>
        </tbody>
        </table>
        
        <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @prev-page="prevPage"
        @next-page="nextPage"
        />
    </div>
  </div>
</template>

<script>
import DataService from '../services/DataService';
import Pagination from './PaginationBar';
import SearchBar from './SearchBar';

export default {
  name: 'DataTable',
  components: {
    Pagination,
    SearchBar
  },
  data() {
    return {
      data: [],
      filteredData: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      sortKey: '',
      sortOrder: 'asc',
      loading: false, 
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      DataService.fetchData().then(response => {
        this.data = response.data;
        this.filteredData = this.data;
        this.loading = false;
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.loading = false;
      });
    },
    filterData(query) {
      this.searchQuery = query;
      this.filteredData = this.data.filter(item => {
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    sortData(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }

      this.filteredData.sort((a, b) => {
        let result = 0;
        if (a[key] < b[key]) result = -1;
        if (a[key] > b[key]) result = 1;
        return this.sortOrder === 'asc' ? result : -result;
      });
    },
    getSortClass(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      }
      return 'fas fa-sort';
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    deleteItem(id) {
      this.filteredData = this.filteredData.filter(item => item.id !== id);
      this.data = this.data.filter(item => item.id !== id);
    },
    updatePageSize() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  cursor: pointer;
}

.sortable:hover {
  background-color: #f1f1f1;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
