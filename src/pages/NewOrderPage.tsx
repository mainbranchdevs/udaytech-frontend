import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, getAddresses } from '../api/endpoints';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function NewOrderPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const itemType = params.get('type') || 'product';
  const itemId = params.get('id') || '';
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [notes, setNotes] = useState('');

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses().then(r => r.data),
  });

  const mutation = useMutation({
    mutationFn: () => createOrder({
      address_id: selectedAddress,
      notes: notes || undefined,
      items: [{ item_type: itemType, item_id: itemId, quantity: 1 }],
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/orders/${res.data.id}`);
    },
  });

  if (addrLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">Place Order</h1>
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
          {addresses?.length ? (
            <div className="space-y-2">
              {addresses.map(a => (
                <label key={a.id} className={`block p-3 border rounded-lg cursor-pointer ${selectedAddress === a.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="radio" name="address" className="sr-only" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} />
                  <p className="text-sm text-gray-900">{a.full_address}</p>
                  <p className="text-xs text-gray-500">{a.city}, {a.state} - {a.pincode}</p>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No saved addresses. You can add one in your profile.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Any special instructions..." />
        </div>
        <Button loading={mutation.isPending} onClick={() => mutation.mutate()} className="w-full" disabled={!itemId}>
          Confirm Order
        </Button>
        {mutation.isError && <p className="text-sm text-red-500">Failed to place order. Please try again.</p>}
      </div>
    </div>
  );
}
