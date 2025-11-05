

import { serverApiClient } from '@/lib/api/serverClient';
import type { Inventory, Item, DiscussionPost, InventoryField } from '@/lib/api/types';
import { InventoryHeader } from './components/InventoryHeader';
import { ItemList } from './components/ItemList';
import { Discussion } from './components/Discussion';

type InventoryPageData = {
  inventory: Inventory;
  fields: InventoryField[];
  items: Item[];
  posts: DiscussionPost[];
};

async function getInventoryPageData(id: string): Promise<InventoryPageData | null> {
  
  const [invData, fieldsData, itemsData, postsData] = await Promise.all([
    serverApiClient.get<Inventory>(`/inventories/${id}`),
    serverApiClient.get<InventoryField[]>(`/inventories/${id}/fields`),
    serverApiClient.get<Item[]>(`/inventories/${id}/items`),
    serverApiClient.get<DiscussionPost[]>(`/inventories/${id}/posts`)
  ]);

  if (!invData || !fieldsData || !itemsData || !postsData) {
    return null;
  }
  
  return {
    inventory: invData,
    fields: fieldsData,
    items: itemsData,
    posts: postsData,
  };
}


export default async function InventoryPage({ params }: { params: { id: string } }) {
  const data = await getInventoryPageData(params.id);

  if (!data) {
    return <p>Инвентарь не найден.</p>;
  }

  const { inventory, fields, items, posts } = data;

  return (
    <div className="space-y-8">
    
      <InventoryHeader initialInventory={inventory} />
      
     
      <ItemList inventoryId={inventory.id} initialItems={items} fields={fields} />
      
      
      <Discussion inventoryId={inventory.id} initialPosts={posts} />
    </div>
  );
}