/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.resources;

import com.docup.server.DatabaseGlue;
import com.docup.server.DoctorService;
import com.docup.server.JPAService;
import javax.persistence.EntityManager;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

/**
 * REST Web Service
 *
 * @author elion
 */
@Path("/ds")
public class DoctorResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of DoctorResource
     */
    public DoctorResource() {
    }

    @GET
    @Path("l/{username}-{password}")
    @Produces("application/json")
    public  com.docup.model.Doctor login(@PathParam("username") String username, @PathParam("password") String password) {
        DatabaseGlue.getEntityManagerFactory().getCache().evictAll();
        com.docup.model.Doctor doc = DatabaseGlue.findDoctor(username, password);
        if(doc != null)
            return doc;
        else
            return new com.docup.model.Doctor(0);
    }

    @POST
    @Consumes({"application/json"})
    @Produces("application/json")
    public com.docup.model.Doctor edit(com.docup.model.Doctor entity) {
        System.out.println("post doctor : " + entity);
        EntityManager entity_manager = DatabaseGlue.getEntityManagerFactory().createEntityManager();
        try {
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            entity_manager.getTransaction().begin();
            JPAService service = new DoctorService(entity_manager);
            if (entity.getId() != null && entity.getId().intValue() == -1) {
                entity.setId(null);
                service.insert(entity);
            } else {
                service.update(entity);
            }
            entity_manager.getTransaction().commit();
            entity_manager.getEntityManagerFactory().getCache().evictAll();

        } catch (Exception e) {
            System.err.println(e.getMessage());
        } finally {
            entity_manager.close();
        }
        if (entity.getId() != null) {
            return (com.docup.model.Doctor) DatabaseGlue.GetObject(com.docup.model.Doctor.class, entity.getId());
        } else {
            return null;
        }
    }
}
