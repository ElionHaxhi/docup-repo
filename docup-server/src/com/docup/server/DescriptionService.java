/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Description;
import com.docup.model.DescriptionType;
import com.docup.model.Visit;
import javax.persistence.EntityManager;

/**
 *
 * @author elion
 */
public class DescriptionService implements JPAService<Description> {
    
    protected EntityManager em;
    
    public DescriptionService(EntityManager em)
    {
        this.em=em;
    }
    
    @Override
    public Description insert(Description entity)
    {
        if(entity.getId() != null && entity.getId() < 0)
        {
            entity.setId(null);
        }
        em.persist(entity);
        em.flush();
        
        return entity;
    }
    
    @Override
    public Description update(Description entity)
    {
        Description current = em.find(Description.class, entity.getId());
        
        current.setContent(entity.getContent());
        
        Visit visit = em.find(Visit.class, entity.getVisitId().getId());
        
        current.setVisitId(visit);
        
        DescriptionType descritpionType = em.find(DescriptionType.class,entity.getType().getId());
        
        current.setType(descritpionType);
        
        em.flush();
        
        return current;
        
    }
    
    @Override
    public void remove(Description entity)
    {
        Description current = em.find(Description.class, entity.getId());
        
        em.remove(current);
        em.flush();
    }
    
    
    
}












