import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { useCombobox, resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    foundProducts: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      price
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export const Search = () => {
  resetIdCounter();
  const router = useRouter();
  const [getProduct, { loading, data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
    fetchPolicy: 'no-cache', // super important. otherwise nothing is returned.
  });

  const getProductDebounced = debounce(getProduct, 400);

  const onInputValueChange = (changes) => {
    getProductDebounced({
      variables: {
        searchTerm: changes.inputValue,
      },
    });
  };

  const onSelectedItemChange = (changes) => {
    // after user selects an item, redirect to the single product page
    const { id } = changes.selectedItem;
    router.push(`/product/${id}`);
  };

  const items = data?.foundProducts || [];
  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    isOpen,
    inputValue,
  } = useCombobox({
    items,
    onInputValueChange,
    onSelectedItemChange,
    itemToString: (item) => (item ? item.name : ''),
  });
  return (
    <SearchStyles {...getComboboxProps()}>
      <input
        {...getInputProps({
          type: 'search',
          placeholder: 'Search for products',
          id: 'search',
          loading: (!!loading).toString(),
        })}
      />
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({
                item,
                index,
                key: item.id,
                highlighted: highlightedIndex === index,
              })}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width={50}
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for ${inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
};
