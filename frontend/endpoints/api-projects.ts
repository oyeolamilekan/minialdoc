import { axiosInstance } from "@/config/api";

export const apiProjects = async () => {
  const { data } = await axiosInstance.get('projects');
  return data;
}

export const createProject = async (body: { title: string, description: string, base_url: string }) => {
  const { data } = await axiosInstance.post('projects/create_project', body);
  return data;
}

export const deleteProject = async (id: string) => {
  const { data } = await axiosInstance.delete(`projects/delete_project/${id}`);
  return data;
}

export const updateProject = async (body: { id: string, title: string, description: string, base_url: string }) => {
  const { data } = await axiosInstance.put(`projects/update_project/${body.id}`, body);
  return data;
}

export const fetchProject = async (id: string) => {
  const { data } = await axiosInstance.get(`projects/fetch_project/${id}`);
  return data;
}

export const createAPISection = async (body: { title: string, sectionId: string }) => {
  const { data } = await axiosInstance.post(`sections/create_section/${body.sectionId}`, body);
  return data;
}

export const updateAPISection = async (body: { title: string, sectionId: string }) => {
  const { data } = await axiosInstance.put(`sections/update_section/${body.sectionId}`, body);
  return data;
}

export const deleteAPISection = async (projectId: string ) => {
  const { data } = await axiosInstance.delete(`sections/delete_section/${projectId}`);
  return data;
}

export const fetchAPISectionAndEndpoints = async (id: string) => {
  const { data } = await axiosInstance.get(`sections/fetch_section_endpoints/${id}`);
  return data;
}

export const fetchAPIEndpoint = async (id: string) => {
  const { data } = await axiosInstance.get(`endpoints/fetch_endpoint/${id}`);
  return data;
}

export const createAPIEndpoint = async (body: { title: string, sectionId: string, projectId: string, endpoint_type: string }) => { 
  const { data } = await axiosInstance.post(`endpoints/create_endpoint/${body.projectId}/${body.sectionId}`, body);
  return data;
}

export const deleteAPIEndpoint = async (endpointId: string) => { 
  const { data } = await axiosInstance.delete(`endpoints/delete_endpoint/${endpointId}`);
  return data;
}

export const updateAPIEndpoint = async (body: { endpointId: string, body?: unknown, content?: unknown, markdown_content?: unknown, title?: string }) => { 
  const { data } = await axiosInstance.put(`endpoints/update_endpoint/${body.endpointId}`, body);
  return data;
}

export const fetchProjectWithEndpoint = async (id: string) => {
  const { data } = await axiosInstance.get(`projects/fetch_project_with_endpoint/${id}`);
  return data;
}