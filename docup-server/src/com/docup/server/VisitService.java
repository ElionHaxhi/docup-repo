/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Description;
import com.docup.model.Patient;
import com.docup.model.Picture;
import com.docup.model.Visit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityManager;

/**
 *
 * @author elion
 */
public class VisitService implements JPAService<Visit> {
    
    protected EntityManager em;
    
    public VisitService(EntityManager em)
    {
        this.em=em;
    }
    
    @Override
    public Visit insert(Visit entity)
    {
        if(entity.getId() !=null && entity.getId() < 0)
        {
            entity.setId(null);
        }
        // nella fase del insret ok ma bisogna tenre conto della possibilita di
        // aggiornare anche la data
        List<Description> descriptionList = 
                entity.getDescriptionList();
        
        
        entity.setDescriptionList(new ArrayList<Description>());
        
        em.persist(entity);
        em.flush();
        
        
        entity.setDescriptionList(descriptionList);
        
        if(entity.getDescriptionList() != null)
        {
            for(Description desc : entity.getDescriptionList())
            {
                if(desc.getId() == null || desc.getId() < 0)
                {
                    desc.setId(null);
                    desc.setVisitId(entity);
                }
            }
        }
        em.merge(entity);
        
        return entity;
    }
    
    @Override
    public Visit update(Visit entity)
    {
        Visit current = em.find(Visit.class, entity.getId());
        
        current.setLastmodDate(entity.getLastmodDate());

        //ho capito quindi lacreatoindate viene creata una volta sollo
        // invecce la lastmodifdate si dovrebbe cambiare ogni volte
        // quindi l'attributto creationDate vienecreato in background invecce
        // lastmodifdate lo si deve camdiare ogni volta che si effetua un aggiornamento
        
        List<Description> descriptionList = new ArrayList<Description>();
        
        if(entity.getDescriptionList() !=null)
        {
            JPAService descriptionService = new DescriptionService(em);
            
            for(Description desc : entity.getDescriptionList())
            {
                if(desc.getId() !=null && desc.getId() > 0)
                {
                    desc.setVisitId(entity);
                    descriptionService.update(desc);
                }
                else
                {
                    desc.setVisitId(entity);
                    descriptionService.insert(entity);
                }
                em.flush();
                
                Description tmp = em.find(Description.class, desc.getId());
                
                descriptionList.add(tmp);
            
            }
        }
        current.setDescriptionList(descriptionList);
        
        if(entity.getPatientId() !=null)
        {
            Patient patient = em.find(Patient.class,entity.getPatientId().getId());
            current.setPatientId(patient);
        }
        
        if(entity.getPictureId() !=null)
        {
            Picture picture = em.find(Picture.class, entity.getPictureId().getId());
            current.setPictureId(picture);
        }
        
        return current;
        
    }
    
    @Override
    public void remove(Visit entity)
    {
        Visit current = em.find(Visit.class,entity.getId());

        if(current !=null)
        {
            current.setTrash(true);
            current.setTrashDate(new Date());

            //faccendo cosi hai tutto le visite cancelate nel database con trash a true
            // se invece attivi la remove e il flush allora la visita si elimina
            //em.remove(current);
            //em.flush();
        }
    }
    
}














