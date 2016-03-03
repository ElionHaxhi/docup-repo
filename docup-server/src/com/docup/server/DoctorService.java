/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Doctor;
import com.docup.model.PersonalInfo;
import java.util.Date;
import javax.persistence.EntityManager;

/**
 *
 * @author elion
 */
public class DoctorService implements JPAService<Doctor>{
    
    
    protected EntityManager em;
    
    public DoctorService(EntityManager em) {
        this.em = em;
    }
    
    @Override
    public Doctor insert(Doctor entity) {
        if (entity.getId() != null && entity.getId()  < 0) {
            entity.setId(null);
        }
        if (entity.getId() != null) {
            System.out.println("Trying to insert an existing doctor: " + entity.getId());
            return entity;
        }
        PersonalInfoService service = new PersonalInfoService(em);
        PersonalInfo info = service.insert(entity.getPersonalInfoId());
        entity.setPersonalInfoId(info);
        entity.setRegistrationDate(new Date());
        
        em.persist(entity);
        em.flush();
        return entity;
    }
    
     @Override
    public Doctor update(Doctor entity) {
        Doctor current = em.find(Doctor.class, entity.getId());
        if (current == null) {
            System.out.println("This patinet doesn't exist in the database: " + entity.getId());
            return entity;
        }
        PersonalInfoService service = new PersonalInfoService(em);
        current.setPersonalInfoId(service.update(entity.getPersonalInfoId()));
//        
//        if (entity.getPicturesId() != null) {
//            Picture picture = em.find(Picture.class, entity.getPicturesId().getId());
//            if (picture == null) {
//                System.out.println("Update patient: This Picture doesn't exist in the database: " + picture);
//            } else {
//                current.setPicturesId(picture);
//            }
//        }
//        else{
//            System.out.println("Update patient: This patient doesn't have a picture: " + entity.getId());
//        }
        return current;
    }
    
     @Override
    public void remove(Doctor entity) {
//        Patient current = em.find(Patient.class, entity.getId());
//        if (current != null) {
//            current.setTrash(true);
//            current.setTrashDate(new Date());
////            em.remove(current);
////            em.flush();
//        } else {
//            System.out.println("Visit not found: " + entity.getId());
//        }
    }
}
