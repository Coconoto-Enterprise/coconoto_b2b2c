-- Secure, atomic order placement for authenticated marketplace buyers.
CREATE OR REPLACE FUNCTION public.create_authenticated_buyer_order(
  p_buyer_id uuid,
  p_product_id uuid,
  p_quantity integer,
  p_delivery_address text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_buyer buyers%ROWTYPE;
  v_product vendor_products%ROWTYPE;
  v_order vendor_orders%ROWTYPE;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RAISE EXCEPTION 'Quantity must be at least 1';
  END IF;

  SELECT * INTO v_buyer FROM buyers WHERE id = p_buyer_id AND is_active = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'Buyer account is unavailable'; END IF;

  SELECT * INTO v_product
  FROM vendor_products
  WHERE id = p_product_id AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Product is unavailable'; END IF;
  IF v_product.stock_quantity < p_quantity THEN RAISE EXCEPTION 'Only % items remain in stock', v_product.stock_quantity; END IF;

  INSERT INTO vendor_orders (
    product_id, vendor_id, buyer_id, customer_name, customer_email,
    customer_phone, quantity, total_price, delivery_address, notes, status
  ) VALUES (
    v_product.id, v_product.vendor_id, v_buyer.id,
    trim(v_buyer.first_name || ' ' || v_buyer.last_name), v_buyer.email,
    coalesce(v_buyer.phone, ''), p_quantity, v_product.price * p_quantity,
    coalesce(nullif(p_delivery_address, ''), v_buyer.address, ''), coalesce(p_notes, ''), 'pending'
  ) RETURNING * INTO v_order;

  UPDATE vendor_products
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE id = v_product.id;

  RETURN to_jsonb(v_order);
END;
$$;

REVOKE ALL ON FUNCTION public.create_authenticated_buyer_order(uuid, uuid, integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_authenticated_buyer_order(uuid, uuid, integer, text, text) TO service_role;

-- Remove the permissive browser policies from the original buyer migration.
DROP POLICY IF EXISTS "Buyers can view their own data" ON buyers;
DROP POLICY IF EXISTS "Buyers can insert their own data" ON buyers;
DROP POLICY IF EXISTS "Buyers can update their own data" ON buyers;

-- Protected buyer and vendor records are accessed by service-role server APIs only.
-- Keep public product browsing available through the server endpoint, not direct anonymous table access.
REVOKE ALL ON buyer_order_history FROM anon, authenticated;
