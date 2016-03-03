/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.resources;

import com.docup.model.Visit;
import com.docup.server.DatabaseGlue;
import com.docup.server.JPAService;
import com.docup.server.VisitService;
import org.eclipse.persistence.jpa.jpql.parser.DateTime;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;

/**
 * REST Web Service
 *
 * @author elion
 */
@Path("vs")
public class VisitsResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of VisitsResource
     */
    public VisitsResource() {
    }

    /**
     * Retrieves representation of an instance of com.docup.resources.VisitsResource
     * @return an instance of java.lang.String
     */
    @GET
    @Path("{id}")
    @Produces("application/json")
    public List getVisitsOfPatient(@PathParam("id") Integer id) {
        
        List<com.docup.model.Visit> retval = new ArrayList<com.docup.model.Visit>();
        
        DatabaseGlue.getEntityManagerFactory().getCache().evictAll();
        
        com.docup.model.Patient pat = (com.docup.model.Patient)
                DatabaseGlue.GetObject(com.docup.model.Patient.class, id);








        if(pat !=null)
        {
            List<com.docup.model.Visit> list = pat.getVisitList();
            
            for(com.docup.model.Visit visit : list)
            {

                if(!visit.getTrash())
                {
                    retval.add(visit);
                }
            }
        }
        
        return retval;
    }


    /**
     *  ok qui li devo passare l'id della visita e poi devo ricavare la visita
     *  e poi basta
     * */
    @GET
    @Path("get/{id}")
    @Produces("application/json")
    public  com.docup.model.Visit get(@PathParam("id") Integer id) {
        DatabaseGlue.getEntityManagerFactory().getCache().evictAll();
        com.docup.model.Visit visit = (com.docup.model.Visit) DatabaseGlue.GetObject(com.docup.model.Visit.class, id);
        if(visit != null)
            return visit;
        else
            return new com.docup.model.Visit(0);
    }

    /**
     * PUT method for updating or creating an instance of VisitsResource
     * @param entity
     * @param content representation for the resource
     * @return an HTTP response with content of the updated or created resource.
     */
    @PUT
    @Path("{id}")
    @Consumes({"application/json"})
    @Produces("application/json")
    public Visit editVisit(Visit entity) 
    {
        //il put fa un update di una visita che ce gia
        EntityManager entity_manager =
                DatabaseGlue.getEntityManagerFactory().createEntityManager();
        
        try
        {
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            entity_manager.getTransaction().begin();
            
            
            JPAService service = new VisitService(entity_manager);
            service.update(entity);
            
            
            entity_manager.getTransaction().commit();
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            
        }
        catch(Exception e)
        {
            System.err.println(e.getMessage());
        }
        finally
        {
            entity_manager.close();
        }
        if(entity.getId() !=null)
        {
            return (Visit)DatabaseGlue.GetObject(Visit.class,entity.getId());
        }
        else
        {
            return null;
        }
    }
    
    @POST
    @Consumes({"application/json"})
    @Produces("application/json")
    public Visit insert(Visit entity)
    {
        EntityManager entity_manager = 
        DatabaseGlue.getEntityManagerFactory().createEntityManager();
    
        try
        {
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            entity_manager.getTransaction().begin();
            
            VisitService service = new VisitService(entity_manager);
            entity.setId(null);
            service.insert(entity);
            entity_manager.getTransaction().commit();
            entity_manager.getEntityManagerFactory().getCache().evictAll();
        }
        catch(Exception e)
        {
            System.err.println(e.getMessage());
        }
        finally
        {
            entity_manager.close();
        }
        
        if(entity.getId() !=null)
        {
            return (Visit)DatabaseGlue.GetObject(Visit.class,entity.getId());
        }
        else
        {
            return null;
        }
        
    }
    
    @DELETE
    @Path("{id}")
    public void delete(@PathParam("id") Integer id)
    {
        if(id == null)
        {
        }
        else
        {
            EntityManager entity_manager =
                    DatabaseGlue.getEntityManagerFactory().createEntityManager();
            try
            {
                Visit entity = (Visit)DatabaseGlue.GetObject(Visit.class, id);
                
                entity_manager.getEntityManagerFactory().getCache().evictAll();
                entity_manager.getTransaction().begin();
                
                VisitService service = new VisitService(entity_manager);
                service.remove(entity);
                
                entity_manager.getTransaction().commit();
                entity_manager.getEntityManagerFactory().getCache().evictAll();
            }
            catch(Exception e)
            {
                System.err.println(e.getMessage());
            }
            finally
            {
                entity_manager.close();
            }
                    
        }
    }
}











