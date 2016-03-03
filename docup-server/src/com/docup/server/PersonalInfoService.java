/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.PersonalInfo;
import javax.persistence.EntityManager;

/**
 *
 * @author elion
 */
public class PersonalInfoService implements JPAService<PersonalInfo>{
    
    
    protected EntityManager em;

    public PersonalInfoService(EntityManager em) {
        this.em = em;
    }
    
    @Override
    public PersonalInfo insert(PersonalInfo entity) {
        if (entity.getId() != null && entity.getId()  < 0){
            entity.setId(null);
        }
        if (entity.getId() != null) {
            System.out.println("Trying to insert an existing Description: " + entity.getId());
            return entity;
        }
        em.persist(entity);
        em.flush();
        return entity;
    }
    
    @Override
    public PersonalInfo update(PersonalInfo entity) {
        PersonalInfo current = em.find(PersonalInfo.class, entity.getId());
        if(current == null){
            System.out.println("This PersonlInfo doesn't exist in the database: " + entity.getId());
            return entity;
        }
        current.setName(entity.getName());
        current.setSurname(entity.getSurname());
        current.setAddress(entity.getAddress());
        current.setCellphone(entity.getCellphone());
        current.setEmail(entity.getEmail());
        current.setTelephone(entity.getTelephone());
        return current;
    }
    
    @Override
    public void remove(PersonalInfo entity) {
        PersonalInfo current = em.find(PersonalInfo.class, entity.getId());
        if (current != null) {
            em.remove(current);
            em.flush();
        } else {
            System.out.println("PersonalInfo not found: " + entity.getId());
        }
    }
}
