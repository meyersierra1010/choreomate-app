import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "react-query";
import supabase from "./supabase";

// React Query client
const client = new QueryClient();

/**** USERS ****/

// Fetch user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery(
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    ["user", { uid }],
    // Query function that fetches data
    () =>
      supabase
        .from("users")
        .select(`*, customers ( * )`)
        .eq("id", uid)
        .single()
        .then(handle),
    // Only call query function if we have a `uid`
    { enabled: !!uid }
  );
}

// Fetch user data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid) {
  return supabase
    .from("users")
    .select(`*, customers ( * )`)
    .eq("id", uid)
    .single()
    .then(handle);
}

// Update an existing user
export async function updateUser(uid, data) {
  const response = await supabase
    .from("users")
    .update(data)
    .eq("id", uid)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["user", { uid }]);
  return response;
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Fetch project data
export function useItem(id) {
  return useQuery(
    ["project", { id }],
    () => supabase.from("projects").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch project data
export function useVideo(id) {
  return useQuery(
    ["videos", { id }],
    () => supabase.from("videos").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch project data
export function useMusic(id) {
  return useQuery(
    ["musics", { id }],
    () => supabase.from("musics").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch all projects by owner
export function useItemsByOwner(owner) {
  return useQuery(
    ["projects", { owner }],
    () =>
      supabase
        .from("projects")
        .select()
        .eq("owner", owner)
        .order("createdAt", { ascending: false })
        .then(handle),
    { enabled: !!owner }
  );
}


// Fetch all projects by owner
export function useVideosByOwner(owner) {
  return useQuery(
    ["videos", { owner }],
    () =>
      supabase
        .from("videos")
        .select()
        .eq("owner", owner)
        .order("createdAt", { ascending: false })
        .then(handle),
    { enabled: !!owner }
  );
}

export function useMusicsByOwner(owner) {
  return useQuery(
    ["musics", { owner }],
    () =>
      supabase
        .from("musics")
        .select()
        .eq("owner", owner)
        .order("createdAt", { ascending: false })
        .then(handle),
    { enabled: !!owner }
  );
}

export function useItemsById(id) {
  return useQuery(
    ["projects", { id }],
    () =>
      supabase
        .from("projects")
        .select()
        .eq("id", id)
        .then(handle)
  );
}

export function getLatestProjectHistory( userId, projectId ) {

  return new Promise( async (resolve) => {

    const { count } = await supabase.from('history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('createdAt', { ascending: false });

    if( !count ) {

      resolve( null );
      return;

    }

    const response = await supabase.from('history')
      .select()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .single()
      .then(handle);
    
    await client.invalidateQueries(['history']);

    resolve( response )
    
  });

}

export function getRecentProjectHistory( userId, projectId ) {

  return new Promise( async (resolve) => {

    const { count } = await supabase.from('history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('createdAt', { ascending: false });

    if( !count ) {

      resolve( [] );
      return;

    }

    const limitCount = count > 10 ? 10 : count;

    const response = await supabase.from('history')
      .select()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('createdAt', { ascending: false })
      .limit(limitCount)
      .then(handle);
    
    await client.invalidateQueries(['history']);

    resolve( response )
    
  });

}

// Create a new project
export async function createItem(data) {
  const response = await supabase.from("projects").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["projects"]);
  return response;
}

export async function createVideo(data) {
  const response = await supabase.from("videos").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["videos"]);
  return response[0];
}

export async function createMusic(data) {
  const response = await supabase.from("musics").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["musics"]);
  return response[0];
}

export async function createHistory(data) {
  const response = await supabase.from("history").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["history"]);
  return response[0];
}

// Update an project
export async function updateItem(id, data) {
  const response = await supabase
    .from("projects")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["project", { id }]),
    client.invalidateQueries(["projects"]),
  ]);
  return response;
}

//Update an project
export async function updateVideo(id, data) {
  const response = await supabase
    .from("videos")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["videos", { id }]),
    client.invalidateQueries(["videos"]),
  ]);
  return response;
}

// Delete an project
export async function deleteVideo(id) {
  const response = await supabase
    .from("videos")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["video", { id }]),
    client.invalidateQueries(["videos"]),
  ]);
  return response;
}

//Update a music
export async function updateMusic(id, data) {
  const response = await supabase
    .from("musics")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["music", { id }]),
    client.invalidateQueries(["musics"]),
  ]);
  return response;
}

// Delete a music
export async function deleteMusic(id) {
  const response = await supabase
    .from("musics")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["music", { id }]),
    client.invalidateQueries(["musics"]),
  ]);
  return response;
}

// Delete an project
export async function deleteItem(id) {
  const response = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["project", { id }]),
    client.invalidateQueries(["projects"]),
  ]);
  return response;
}



/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response) {
  if (response.error) throw response.error;
  return response.data;
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
