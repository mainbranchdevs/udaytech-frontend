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
    queryFn: () => getAddresses().then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: () =>
      createOrder({
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
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Place Order
      </h1>

      <div
        className="p-4 flex flex-col gap-4"
        style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Delivery Address
          </label>
          {addresses?.length ? (
            <div className="flex flex-col gap-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className="block p-3 cursor-pointer transition-colors"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: selectedAddress === a.id ? '1.5px solid var(--brand-500)' : '1.5px solid var(--border-default)',
                    background: selectedAddress === a.id ? 'var(--brand-50)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="address"
                    className="sr-only"
                    checked={selectedAddress === a.id}
                    onChange={() => setSelectedAddress(a.id)}
                  />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{a.full_address}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {a.city}, {a.state} - {a.pincode}
                  </p>
                </label>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              No saved addresses. You can add one in your profile.
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 outline-none"
            style={{
              border: '1.5px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              background: 'var(--surface-card)',
              color: 'var(--text-primary)',
            }}
            placeholder="Any special instructions..."
          />
        </div>

        <Button
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          fullWidth
          variant="accent"
          disabled={!itemId}
        >
          Confirm Order
        </Button>

        {mutation.isError && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)' }}>
            Failed to place order. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
