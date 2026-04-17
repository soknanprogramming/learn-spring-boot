import axios from "axios";
import { useEffect, useEffectEvent, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
};

type ProductDraft = {
  name: string;
  price: string;
  quantity: string;
  description: string;
};

type PostSummary = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
};

type AuthResponse = {
  message: string;
  token?: string | null;
};

type ApiError = {
  message?: string;
  error?: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
const tokenStorageKey = "spring-ui-jwt";

const emptyProductDraft: ProductDraft = {
  name: "",
  price: "",
  quantity: "",
  description: "",
};

function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem(tokenStorageKey) || "");
  const [healthMessage, setHealthMessage] = useState("Checking backend...");
  const [healthError, setHealthError] = useState("");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState("");
  const [productError, setProductError] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft);

  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postError, setPostError] = useState("");
  const [selectedPost, setSelectedPost] = useState<PostSummary | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImageUrls, setPostImageUrls] = useState<Record<number, string>>({});

  const fetchHealthEvent = useEffectEvent(fetchHealth);

  useEffect(() => {
    fetchHealthEvent();
  }, []);

  useEffect(() => {
    localStorage.setItem(tokenStorageKey, token);
  }, [token]);

  useEffect(() => {
    return () => {
      Object.values(postImageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [postImageUrls]);

  const loadProductsEvent = useEffectEvent(loadProducts);
  const loadPostsEvent = useEffectEvent(loadPosts);

  useEffect(() => {
    if (!token) {
      setProducts([]);
      setPosts([]);
      setSelectedProduct(null);
      setSelectedPost(null);
      return;
    }

    void loadProductsEvent();
    void loadPostsEvent();
  }, [token]);

  async function fetchHealth() {
    setHealthError("");
    try {
      const response = await axios.get<string>(`${apiBaseUrl}/`);
      setHealthMessage(response.data);
    } catch (error) {
      setHealthError(readErrorMessage(error));
      setHealthMessage("Backend unavailable");
    }
  }

  function authHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function readErrorMessage(error: unknown) {
    if (axios.isAxiosError<ApiError>(error)) {
      return error.response?.data?.message || error.response?.data?.error || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Unexpected error";
  }

  function resetProductEditor() {
    setEditingProductId(null);
    setProductDraft(emptyProductDraft);
  }

  function resetPostEditor() {
    setEditingPostId(null);
    setPostTitle("");
    setPostContent("");
    setPostImage(null);
  }

  async function submitAuth() {
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const endpoint = authMode === "login" ? "/login" : "/register";
      const response = await axios.post<AuthResponse>(`${apiBaseUrl}${endpoint}`, {
        username: authUsername,
        password: authPassword,
      });

      setAuthMessage(response.data.message);

      if (authMode === "login" && response.data.token) {
        setToken(response.data.token);
      }

      if (authMode === "register") {
        setAuthMode("login");
      }
    } catch (error) {
      setAuthError(readErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadProducts() {
    if (!token) {
      return;
    }

    setProductLoading(true);
    setProductError("");
    try {
      const response = await axios.get<Product[]>(`${apiBaseUrl}/api/products/`, {
        headers: authHeaders(),
      });
      setProducts(response.data);
    } catch (error) {
      setProductError(readErrorMessage(error));
    } finally {
      setProductLoading(false);
    }
  }

  async function searchProducts() {
    if (!token) {
      return;
    }

    setProductLoading(true);
    setProductError("");
    try {
      const response = await axios.get<Product[]>(`${apiBaseUrl}/api/products/search`, {
        headers: authHeaders(),
        params: { keyword: productSearch },
      });
      setProducts(response.data);
    } catch (error) {
      setProductError(readErrorMessage(error));
    } finally {
      setProductLoading(false);
    }
  }

  async function fetchProductById(id: number) {
    setProductError("");
    try {
      const response = await axios.get<Product>(`${apiBaseUrl}/api/products/${id}`, {
        headers: authHeaders(),
      });
      setSelectedProduct(response.data);
    } catch (error) {
      setProductError(readErrorMessage(error));
    }
  }

  async function saveProduct() {
    setProductError("");
    setProductMessage("");

    const payload = {
      name: productDraft.name,
      price: Number(productDraft.price),
      quantity: Number(productDraft.quantity),
      description: productDraft.description,
    };

    try {
      if (editingProductId === null) {
        await axios.post(`${apiBaseUrl}/api/products/`, payload, {
          headers: authHeaders(),
        });
        setProductMessage("Product created.");
      } else {
        await axios.put(`${apiBaseUrl}/api/products/${editingProductId}`, payload, {
          headers: authHeaders(),
        });
        setProductMessage(`Product #${editingProductId} updated.`);
      }

      resetProductEditor();
      await loadProducts();
    } catch (error) {
      setProductError(readErrorMessage(error));
    }
  }

  async function deleteProduct(id: number) {
    setProductError("");
    setProductMessage("");

    try {
      await axios.delete(`${apiBaseUrl}/api/products/${id}`, {
        headers: authHeaders(),
      });
      setProductMessage(`Product #${id} deleted.`);
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      if (editingProductId === id) {
        resetProductEditor();
      }
      await loadProducts();
    } catch (error) {
      setProductError(readErrorMessage(error));
    }
  }

  async function loadPosts() {
    if (!token) {
      return;
    }

    setPostLoading(true);
    setPostError("");
    try {
      const response = await axios.get<PostSummary[]>(`${apiBaseUrl}/api/post/`, {
        headers: authHeaders(),
      });
      setPosts(response.data);
    } catch (error) {
      setPostError(readErrorMessage(error));
    } finally {
      setPostLoading(false);
    }
  }

  async function fetchPostById(id: number) {
    setPostError("");
    try {
      const response = await axios.get<PostSummary>(`${apiBaseUrl}/api/post/${id}`, {
        headers: authHeaders(),
      });
      setSelectedPost(response.data);
    } catch (error) {
      setPostError(readErrorMessage(error));
    }
  }

  async function loadPostImage(id: number) {
    setPostError("");

    try {
      const response = await axios.get<Blob>(`${apiBaseUrl}/api/post/${id}/image`, {
        headers: authHeaders(),
        responseType: "blob",
      });
      const nextUrl = URL.createObjectURL(response.data);
      setPostImageUrls((current) => {
        const existingUrl = current[id];
        if (existingUrl) {
          URL.revokeObjectURL(existingUrl);
        }
        return { ...current, [id]: nextUrl };
      });
    } catch (error) {
      setPostError(readErrorMessage(error));
    }
  }

  async function savePost() {
    setPostError("");
    setPostMessage("");

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("content", postContent);
    if (postImage) {
      formData.append("image", postImage);
    }

    try {
      if (editingPostId === null) {
        if (!postImage) {
          setPostError("An image is required when creating a post.");
          return;
        }

        await axios.post(`${apiBaseUrl}/api/post/`, formData, {
          headers: authHeaders(),
        });
        setPostMessage("Post created.");
      } else {
        await axios.put(`${apiBaseUrl}/api/post/${editingPostId}`, formData, {
          headers: authHeaders(),
        });
        setPostMessage(`Post #${editingPostId} updated.`);
      }

      resetPostEditor();
      await loadPosts();
    } catch (error) {
      setPostError(readErrorMessage(error));
    }
  }

  async function deletePost(id: number) {
    setPostError("");
    setPostMessage("");

    try {
      await axios.delete(`${apiBaseUrl}/api/post/${id}`, {
        headers: authHeaders(),
      });
      setPostMessage(`Post #${id} deleted.`);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
      if (editingPostId === id) {
        resetPostEditor();
      }
      setPostImageUrls((current) => {
        const next = { ...current };
        if (next[id]) {
          URL.revokeObjectURL(next[id]);
          delete next[id];
        }
        return next;
      });
      await loadPosts();
    } catch (error) {
      setPostError(readErrorMessage(error));
    }
  }

  function beginProductEdit(product: Product) {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      description: product.description,
    });
  }

  function beginPostEdit(post: PostSummary) {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostImage(null);
  }

  const locked = !token;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_30%),linear-gradient(135deg,_var(--ink),_var(--ocean))] text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">
        <section className="grid gap-6 rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Spring Boot Control Desk</p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              One UI for every live backend endpoint.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              This dashboard exercises the root health endpoint, register/login, product CRUD and search,
              and post CRUD plus protected image retrieval.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <StatusBadge label="API Base" value={apiBaseUrl} />
              <StatusBadge label="Health" value={healthMessage} />
            </div>
            {healthError ? <InlineError message={healthError} /> : null}
          </div>

          <section className="rounded-[1.5rem] bg-slate-950/40 p-5">
            <div className="mb-4 flex gap-2 rounded-full bg-white/8 p-1">
              <ToggleButton active={authMode === "login"} onClick={() => setAuthMode("login")}>
                Login
              </ToggleButton>
              <ToggleButton active={authMode === "register"} onClick={() => setAuthMode("register")}>
                Register
              </ToggleButton>
            </div>

            <div className="space-y-3">
              <LabeledInput label="Username" value={authUsername} onChange={setAuthUsername} />
              <LabeledInput
                label="Password"
                type="password"
                value={authPassword}
                onChange={setAuthPassword}
              />
              <button
                className="w-full rounded-full bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
                onClick={() => void submitAuth()}
                disabled={authLoading}
                type="button"
              >
                {authLoading ? "Working..." : authMode === "login" ? "Get JWT" : "Create account"}
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {authMessage ? <InlineSuccess message={authMessage} /> : null}
              {authError ? <InlineError message={authError} /> : null}
              {token ? (
                <div className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-3 text-emerald-100">
                  <p className="font-semibold">Authenticated</p>
                  <p className="mt-1 break-all text-xs text-emerald-50/90">{token}</p>
                  <button
                    className="mt-3 rounded-full border border-emerald-200/40 px-3 py-1 text-xs font-semibold"
                    onClick={() => {
                      setToken("");
                      setAuthMessage("Signed out.");
                    }}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <p className="text-slate-300">Login is required before product and post requests will work.</p>
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/12 bg-slate-950/45 p-6 backdrop-blur">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Products</p>
                <h2 className="mt-2 text-3xl font-black">CRUD + search</h2>
              </div>
              <button
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                onClick={() => void loadProducts()}
                type="button"
              >
                Refresh
              </button>
            </div>

            <GuardBanner locked={locked} />
            {productMessage ? <InlineSuccess message={productMessage} /> : null}
            {productError ? <InlineError message={productError} /> : null}

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto]">
              <input
                className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none placeholder:text-slate-400"
                placeholder="Search name, description, price, quantity"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
              />
              <button
                className="rounded-2xl bg-white px-4 py-3 font-bold text-slate-900 disabled:opacity-40"
                onClick={() => void searchProducts()}
                type="button"
                disabled={locked || productLoading}
              >
                Search
              </button>
              <button
                className="rounded-2xl border border-white/20 px-4 py-3 font-semibold disabled:opacity-40"
                onClick={() => {
                  setProductSearch("");
                  void loadProducts();
                }}
                type="button"
                disabled={locked || productLoading}
              >
                Reset
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold">{editingProductId === null ? "Create product" : `Edit #${editingProductId}`}</h3>
                {editingProductId !== null ? (
                  <button className="text-sm text-cyan-200" onClick={resetProductEditor} type="button">
                    Cancel edit
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <LabeledInput
                  label="Name"
                  value={productDraft.name}
                  onChange={(value) => setProductDraft((current) => ({ ...current, name: value }))}
                  disabled={locked}
                />
                <LabeledInput
                  label="Price"
                  type="number"
                  value={productDraft.price}
                  onChange={(value) => setProductDraft((current) => ({ ...current, price: value }))}
                  disabled={locked}
                />
                <LabeledInput
                  label="Quantity"
                  type="number"
                  value={productDraft.quantity}
                  onChange={(value) => setProductDraft((current) => ({ ...current, quantity: value }))}
                  disabled={locked}
                />
                <LabeledTextarea
                  label="Description"
                  value={productDraft.description}
                  onChange={(value) => setProductDraft((current) => ({ ...current, description: value }))}
                  disabled={locked}
                />
              </div>
              <button
                className="mt-4 rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-40"
                onClick={() => void saveProduct()}
                type="button"
                disabled={locked}
              >
                {editingProductId === null ? "POST /api/products/" : `PUT /api/products/${editingProductId}`}
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product.id} className="bg-slate-950/20">
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">${product.price}</td>
                      <td className="px-4 py-3">{product.quantity}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <ActionButton onClick={() => void fetchProductById(product.id)} disabled={locked}>
                            GET
                          </ActionButton>
                          <ActionButton onClick={() => beginProductEdit(product)} disabled={locked}>
                            Edit
                          </ActionButton>
                          <ActionButton tone="danger" onClick={() => void deleteProduct(product.id)} disabled={locked}>
                            Delete
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!productLoading && products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-300">
                        No products returned.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {selectedProduct ? (
              <article className="mt-6 rounded-[1.5rem] bg-white text-slate-900 shadow-lg">
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">GET /api/products/{selectedProduct.id}</p>
                  <h3 className="mt-1 text-2xl font-black">{selectedProduct.name}</h3>
                </div>
                <div className="grid gap-3 px-5 py-4 text-sm md:grid-cols-2">
                  <DetailItem label="Price" value={`$${selectedProduct.price}`} />
                  <DetailItem label="Quantity" value={String(selectedProduct.quantity)} />
                  <DetailItem label="Description" value={selectedProduct.description || "No description"} span />
                </div>
              </article>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-white/12 bg-slate-950/45 p-6 backdrop-blur">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Posts</p>
                <h2 className="mt-2 text-3xl font-black">Multipart CRUD + image fetch</h2>
              </div>
              <button
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                onClick={() => void loadPosts()}
                type="button"
              >
                Refresh
              </button>
            </div>

            <GuardBanner locked={locked} />
            {postMessage ? <InlineSuccess message={postMessage} /> : null}
            {postError ? <InlineError message={postError} /> : null}

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold">{editingPostId === null ? "Create post" : `Edit #${editingPostId}`}</h3>
                {editingPostId !== null ? (
                  <button className="text-sm text-cyan-200" onClick={resetPostEditor} type="button">
                    Cancel edit
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3">
                <LabeledInput label="Title" value={postTitle} onChange={setPostTitle} disabled={locked} />
                <LabeledTextarea label="Content" value={postContent} onChange={setPostContent} disabled={locked} />
                <label className="text-sm font-semibold text-slate-200">
                  Image
                  <input
                    className="mt-2 block w-full rounded-2xl border border-dashed border-white/25 bg-white/6 px-4 py-3 text-sm"
                    type="file"
                    accept="image/*"
                    disabled={locked}
                    onChange={(event) => setPostImage(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <button
                className="mt-4 rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-40"
                onClick={() => void savePost()}
                type="button"
                disabled={locked}
              >
                {editingPostId === null ? "POST /api/post/" : `PUT /api/post/${editingPostId}`}
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {posts.map((post) => (
                <article key={post.id} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Post #{post.id}</p>
                      <h3 className="mt-2 text-2xl font-black">{post.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{post.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ActionButton onClick={() => void fetchPostById(post.id)} disabled={locked}>
                        GET
                      </ActionButton>
                      <ActionButton onClick={() => beginPostEdit(post)} disabled={locked}>
                        Edit
                      </ActionButton>
                      <ActionButton onClick={() => void loadPostImage(post.id)} disabled={locked}>
                        Image
                      </ActionButton>
                      <ActionButton tone="danger" onClick={() => void deletePost(post.id)} disabled={locked}>
                        Delete
                      </ActionButton>
                    </div>
                  </div>

                  {postImageUrls[post.id] ? (
                    <img
                      alt={post.title}
                      className="mt-4 h-56 w-full rounded-[1.25rem] object-cover"
                      src={postImageUrls[post.id]}
                    />
                  ) : null}
                </article>
              ))}
              {!postLoading && posts.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-6 text-center text-slate-300">
                  No posts returned.
                </div>
              ) : null}
            </div>

            {selectedPost ? (
              <article className="mt-6 rounded-[1.5rem] bg-white text-slate-900 shadow-lg">
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">GET /api/post/{selectedPost.id}</p>
                  <h3 className="mt-1 text-2xl font-black">{selectedPost.title}</h3>
                </div>
                <div className="space-y-4 px-5 py-4">
                  <p className="text-sm leading-7 text-slate-700">{selectedPost.content}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Image endpoint: {selectedPost.imageUrl}
                  </p>
                </div>
              </article>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}

type ToggleButtonProps = {
  active: boolean;
  children: string;
  onClick: () => void;
};

function ToggleButton({ active, children, onClick }: ToggleButtonProps) {
  return (
    <button
      className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${
        active ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
};

function LabeledInput({ label, value, onChange, type = "text", disabled = false }: LabeledInputProps) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      <input
        className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

type LabeledTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function LabeledTextarea({ label, value, onChange, disabled = false }: LabeledTextareaProps) {
  return (
    <label className="block text-sm font-semibold text-slate-200 md:col-span-2">
      {label}
      <textarea
        className="mt-2 min-h-28 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
  span?: boolean;
};

function DetailItem({ label, value, span = false }: DetailItemProps) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-base text-slate-800">{value}</p>
    </div>
  );
}

type ActionButtonProps = {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
};

function ActionButton({ children, onClick, disabled = false, tone = "default" }: ActionButtonProps) {
  const className =
    tone === "danger"
      ? "rounded-full border border-rose-300/35 bg-rose-400/10 px-3 py-2 text-xs font-bold text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-40"
      : "rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-slate-100 transition hover:bg-white/14 disabled:opacity-40";

  return (
    <button className={className} onClick={onClick} type="button" disabled={disabled}>
      {children}
    </button>
  );
}

function GuardBanner({ locked }: { locked: boolean }) {
  if (!locked) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
      Protected endpoints are locked until you log in and receive a JWT.
    </div>
  );
}

function InlineError({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-300/35 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{message}</div>;
}

function InlineSuccess({ message }: { message: string }) {
  return <div className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div>;
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2">
      <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-300">{label}</span>
      <span className="font-semibold text-slate-50">{value}</span>
    </div>
  );
}

export default App;
