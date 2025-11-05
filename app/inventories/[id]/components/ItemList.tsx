'use client';

import { useState } from 'react';
import type { Item, InventoryField } from '@/lib/api/types';
import { Button } from '@/components/ui/button';

interface ItemListProps {
  inventoryId: string;
  initialItems: Item[];
  fields: InventoryField[]; 
}

export function ItemList({ inventoryId, initialItems, fields }: ItemListProps) {
  const [items, setItems] = useState(initialItems);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const tableFields = fields.filter((f) => f.show_in_table);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Элементы</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Отмена' : 'Добавить элемент'}
        </Button>
      </div>

    
      {showCreateForm && (
        <div className="my-6 rounded border border-dashed p-4">
          <h3 className="text-lg font-semibold">Новый элемент</h3>
          <p className="mt-2 text-muted-foreground">
            Здесь будет наша динамическая форма, основанная на {fields.length} полях.
          </p>
        
        </div>
      )}

    
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                В этом инвентаре пока нет элементов.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                      Custom ID
                    </th>
                 
                    {tableFields.map((field) => (
                      <th key={field.id} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                        {field.title}
                      </th>
                    ))}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                        
                        <a href={`/inventories/${inventoryId}/items/${item.id}`} className="text-primary hover:underline">
                          {item.custom_id || 'N/A'}
                        </a>
                      </td>
                      
                     
                      {tableFields.map((field) => (
                        <td key={field.id} className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                          
                          {item.values?.[field.id] ? String(item.values[field.id]) : '—'}
                        </td>
                      ))}
                      
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href={`/inventories/${inventoryId}/items/${item.id}`} className="text-primary hover:underline">
                          Открыть<span className="sr-only">, {item.custom_id}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}