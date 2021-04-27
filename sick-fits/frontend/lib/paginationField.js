import { TOTAL_PRODUCTS_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: TOTAL_PRODUCTS_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1; // current page being fetched
      const pages = Math.ceil(count / first);

      // get items on this page from existing
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if on the last page where the item.length < first
      if (items.length && items.length <= first && page === pages) {
        console.log('1', items);
        return items;
      }

      // if there are items returned from these indices, return from cache
      if (items.length === first) {
        console.log('2', items);
        return items;
      }
      // if no items returned from these indices, fetch from network and merge!
      if (items.length !== first) {
        console.log('3', items);
        console.log('3 skip', skip);
        console.log('3 first', first);
        console.log('3 existing', existing);
        return false;
      }
      // fallback to always fetch from network
      console.log('4', items);
      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log(`Merging items from network ${incoming.length}`);
      // make a duplicate of the existing array
      const merged = existing ? existing.slice(0) : [];
      // add the items into the corresponding indices in the existing array
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log('merged', merged);
      return merged;
    },
  };
}
