/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Doctor;
import com.docup.model.Patient;
import com.docup.model.PersonalInfo;
import com.docup.model.Picture;
import java.util.Date;
import javax.persistence.EntityManager;

/**
 *
 * @author elion
 */
public class PatientService implements JPAService<Patient> {
    
    protected EntityManager em;

    public PatientService(EntityManager em) {
        this.em = em;
    }
    
    @Override
    public Patient insert(Patient entity) {
        if (entity.getId() != null && entity.getId()  < 0) {
            entity.setId(null);
        }
        if (entity.getId() != null) {
            System.out.println("Trying to insert an existing patient: " + entity.getId());
            return entity;
        }
        PersonalInfoService service = new PersonalInfoService(em);
        PersonalInfo info = service.insert(entity.getPersonalInfoId());
        entity.setPersonalInfoId(info);
        em.persist(entity);
        em.flush();
        for (Doctor doctor : entity.getDoctorList()) {
            Doctor d = em.find(Doctor.class, doctor.getId());
            d.getPatientList().add(entity);
        }
        return entity;
    }
    
    @Override
    public Patient update(Patient entity) {
        Patient current = em.find(Patient.class, entity.getId());
        if (current == null) {
            System.out.println("This patinet doesn't exist in the database: " + entity.getId());
            return entity;
        }
        PersonalInfoService service = new PersonalInfoService(em);
        current.setPersonalInfoId(service.update(entity.getPersonalInfoId()));
        
        if (entity.getPictureId()!= null) {
            Picture picture = em.find(Picture.class, entity.getPictureId().getId());
            if (picture == null) {
                System.out.println("Update patient: This Picture doesn't exist in the database: " + picture);
            } else {
                current.setPictureId(picture);
            }
        }
        else{
            System.out.println("Update patient: This patient doesn't have a picture: " + entity.getId());
        }
        return current;
    }
     @Override
    public void remove(Patient entity) {
        Patient current = em.find(Patient.class, entity.getId());
        if (current != null) {
            current.setTrash(true);
            current.setTrashDate(new Date());
//            em.remove(current);
//            em.flush();
        } else {
            System.out.println("Visit not found: " + entity.getId());
        }
    }
    
    
}
