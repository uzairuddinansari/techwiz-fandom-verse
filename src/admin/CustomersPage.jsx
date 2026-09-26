import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Search, ShoppingBag, UserPlus, Users } from "lucide-react";
import { categories, formatPrice } from "../fandom/catalog";
import { allUsers, getAllOrders, getOrders } from "../fandom/auth";
import { EmptyState, PageHeader, Panel, StatCard } from "./AdminUI";

/* Accounts from src/JSON/users.json plus sign-ups and orders saved in this browser. */
export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const users = allUsers();
  const orders = getAllOrders();
  const revenue = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const hubName = (slug) => categories.find((category) => category.slug === slug)?.name || slug;

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = users
    .map((user) => {
      const own = getOrders(user.id);
      return { ...user, orderCount: own.length, spent: own.reduce((sum, order) => sum + order.totals.total, 0) };
    })
    .filter((user) => words.every((word) => `${user.name} ${user.email}`.toLowerCase().includes(word)));

  return (
    <>
      <PageHeader
        eyebrow="Customers"
        title="Customers & orders"
        description="Demo accounts come from src/JSON/users.json; sign-ups and orders are stored in this browser. No payments are taken."
      />

      <div className="adm-stats adm-stats-4">
        <StatCard icon={Users} label="Accounts" value={users.length} hint={`${users.filter((user) => user.source === "browser").length} signed up here`} />
        <StatCard icon={Package} label="Orders" value={orders.length} tone="accent" />
        <StatCard icon={ShoppingBag} label="Order value" value={formatPrice(revenue)} hint="Demo — nothing was charged" />
        <StatCard icon={UserPlus} label="Avg. order" value={formatPrice(orders.length ? revenue / orders.length : 0)} />
      </div>

      <Panel
        title={`Accounts (${rows.length})`}
        action={
          <label className="adm-search" style={{ flex: "0 1 280px" }}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search accounts</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email…" />
          </label>
        }
      >
        {rows.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Customer</th><th>Source</th><th>Favourite hubs</th><th>Joined</th><th className="num">Orders</th><th className="num">Spent</th></tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="adm-item">
                        <span className="adm-avatar" style={{ background: user.avatarColor }} aria-hidden="true">{user.name[0]}</span>
                        <div>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className={`adm-badge ${user.source === "json" ? "info" : "good"}`}>{user.source === "json" ? "users.json" : "Browser sign-up"}</span></td>
                    <td>{user.favorites?.length ? user.favorites.map(hubName).join(", ") : "—"}</td>
                    <td>{user.joined}</td>
                    <td className="num">{user.orderCount}</td>
                    <td className="num">{formatPrice(user.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Search} title="No accounts match" />
        )}
      </Panel>

      <Panel title={`Recent orders (${orders.length})`}>
        {orders.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Placed</th><th>Items</th><th>Delivery</th><th className="num">Total</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 25).map((order) => (
                  <tr key={order.id + order.customer.id}>
                    <td><strong>{order.id}</strong><br /><span className="adm-badge good">{order.status}</span></td>
                    <td>{order.customer.name}<br /><small className="adm-muted">{order.customer.email}</small></td>
                    <td>{new Date(order.placedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td>{order.items.map((line) => `${line.quantity}× ${line.title}`).join(", ")}</td>
                    <td>{order.delivery.method}</td>
                    <td className="num">{formatPrice(order.totals.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Package} title="No orders yet">
            <p>Orders placed through <Link to="/shop">the shop</Link> appear here.</p>
          </EmptyState>
        )}
      </Panel>
    </>
  );
}
