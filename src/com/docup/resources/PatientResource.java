/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.resources;


import com.docup.server.DatabaseGlue;
import com.docup.server.JPAService;
import com.docup.server.PatientService;

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
//@Singleton
@Path("/p")
public class PatientResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of PatientResource
     */
    public PatientResource() {
    }
    
    @GET
    @Path("get/{id}")
    @Produces("application/json")
    public  com.docup.model.Patient get(@PathParam("id") Integer id) {
        DatabaseGlue.getEntityManagerFactory().getCache().evictAll();
        com.docup.model.Patient pat = (com.docup.model.Patient) DatabaseGlue.GetObject(com.docup.model.Patient.class, id);
        if(pat != null)
            return pat;
        else
            return new com.docup.model.Patient(0);
    }

    /**
     * Retrieves representation of an instance of com.docup.resources.PatientResource
     * @return an instance of java.lang.String
     */
    @GET
    @Path("{id}")
    @Produces("application/json")
    public List getPatientsOfDoctor(@PathParam("id") Integer id) {
        List<com.docup.model.Patient> retval =new ArrayList<com.docup.model.Patient>();
        DatabaseGlue.getEntityManagerFactory().getCache().evictAll();
        com.docup.model.Doctor doc = (com.docup.model.Doctor)
                DatabaseGlue.GetObject(com.docup.model.Doctor.class, id);
        if (doc != null) {
            List<com.docup.model.Patient> patientList = doc.getPatientList();
            for (com.docup.model.Patient patient : patientList) {
                if(!patient.getTrash()){
                    retval.add(patient);
                }
            }
        }
        return retval;
    }

    @PUT
    @Path("{id}")
    @Consumes({"application/json"})
    @Produces("application/json")
    public com.docup.model.Patient insert(com.docup.model.Patient entity) {
        System.out.println("put patient : " + entity);
        EntityManager entity_manager = DatabaseGlue.getEntityManagerFactory().createEntityManager();
        try {
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            entity_manager.getTransaction().begin();
            JPAService service = new PatientService(entity_manager);
            if (entity.getId() != null && entity.getId().intValue() == -1) {
                entity.setId(null);
                service.insert(entity);
            } else {
                service.update(entity);
            }
            entity_manager.getTransaction().commit();
            entity_manager.getEntityManagerFactory().getCache().evictAll();

        } catch (Exception e) {
            System.err.println("elion "+e.getMessage());
        } finally {
            entity_manager.close();
        }
        if (entity.getId() != null) {
            return (com.docup.model.Patient) DatabaseGlue.GetObject(com.docup.model.Patient.class, entity.getId());
        } else {
            return null;
        }
    }
    
    @POST
    @Consumes({"application/json"})
    @Produces("application/json")
    public com.docup.model.Patient edit(com.docup.model.Patient entity) {
        System.out.println("post patient : " + entity);
        EntityManager entity_manager = DatabaseGlue.getEntityManagerFactory().createEntityManager();
        try {
            entity_manager.getEntityManagerFactory().getCache().evictAll();
            entity_manager.getTransaction().begin();
            JPAService service = new PatientService(entity_manager);
            if (entity.getId() != null && entity.getId().intValue() == -1) {
                entity.setId(null);
                service.insert(entity);
            } else {
                service.update(entity);
            }
            entity_manager.getTransaction().commit();
            entity_manager.getEntityManagerFactory().getCache().evictAll();

        } catch (Exception e) {
            System.err.println("elion"+e.getMessage());
        } finally {
            entity_manager.close();
        }
        if (entity.getId() != null) {
            return (com.docup.model.Patient) DatabaseGlue.GetObject(com.docup.model.Patient.class, entity.getId());
        } else {
            return null;
        }
    }
    
    @DELETE
    @Path("{id}")
    public void delete(@PathParam("id") Integer id) {
        System.out.println("delete patient : " + id);
        if (id == null) {
        } else {
            EntityManager entity_manager = DatabaseGlue.getEntityManagerFactory().createEntityManager();
            try {
                com.docup.model.Patient entity = (com.docup.model.Patient) DatabaseGlue.GetObject(com.docup.model.Patient.class, id);
                entity_manager.getEntityManagerFactory().getCache().evictAll();
                entity_manager.getTransaction().begin();
                JPAService service = new PatientService(entity_manager);
                service.remove(entity);
                entity_manager.getTransaction().commit();
                entity_manager.getEntityManagerFactory().getCache().evictAll();

            } catch (Exception e) {
                System.err.println(e.getMessage());
            } finally {
                entity_manager.close();
            }
        }
    }
}
